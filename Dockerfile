# ----------------------------------------------------------------------
# STAGE 1: BUILD - Untuk menginstal Node.js dan mengompilasi aset frontend
# ----------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ----------------------------------------------------------------------
# STAGE 2: RUNTIME - Lingkungan Produksi (PHP-FPM & Nginx)
# ----------------------------------------------------------------------
FROM richarvey/nginx-php-fpm:latest

# Atur variabel lingkungan dari base image
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config untuk production
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
# Tambahkan APP_KEY placeholder untuk memastikan Artisan dapat boot
# KUNCI ASLI HARUS DIATUR SAAT CONTAINER RUNTIME (misal: docker-compose/K8s)
ENV APP_KEY base64:tHXrep0Ku5Efrf+1V4eO8ylro7+zzRRHN6rpc3zCUBU=
ENV DB_CONNECTION pgsql

ENV SESSION_DRIVER file

# Allow Composer run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

RUN rm -rf /etc/nginx/sites-available/default.conf

COPY default.conf /etc/nginx/sites-available/default.conf

COPY default.conf /etc/nginx/sites-available/laravel.conf

# PENTING: Hapus default config yang bermasalah dan buat symlink
# Ini memaksa Nginx untuk memuat konfigurasi yang diperbaiki
RUN  nginx -t

# Salin kode PHP/Laravel secara eksplisit
COPY . /var/www/html/

# Hapus node_modules jika ada (dari copy awal)
RUN rm -rf /var/www/html/node_modules

# Salin aset frontend yang sudah di-build dari stage builder
COPY --from=builder /app/public/build /var/www/html/public/build

# Instal Composer dependencies (non-dev untuk produksi)
# Jalankan ini sebelum set permissions untuk menghindari masalah ownership saat composer membuat vendor
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

# PENTING: Set Permissions sebelum menjalankan perintah Artisan lainnya
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R ug+rwx /var/www/html/storage /var/www/html/bootstrap/cache

# HAPUS: RUN php artisan key:generate --no-interaction --force (Karena APP_KEY harus diset saat runtime)

# Jalankan migrasi dan cache konfigurasi
RUN php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear

# Expose port
EXPOSE 80

# Start script dari image (Nginx + PHP-FPM)
CMD ["/start.sh"]