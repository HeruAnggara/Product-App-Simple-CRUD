# ----------------------------------------------------------------------
# STAGE 1: BUILD - Untuk menginstal Node.js dan mengompilasi aset frontend (npm run build)
# ----------------------------------------------------------------------
FROM node:20-alpine AS builder

# Atur direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json untuk memanfaatkan cache Docker Layer
COPY package.json package-lock.json ./

# Instal dependensi Node.js, termasuk devDependencies (perlu untuk build)
RUN npm ci

# Salin sisa kode (termasuk kode React/Inertia)
COPY . .

# Jalankan build frontend menggunakan Vite
RUN npm run build


# ----------------------------------------------------------------------
# STAGE 2: RUNTIME - Lingkungan Produksi (PHP-FPM & Nginx)
# ----------------------------------------------------------------------
# Base image: Nginx + PHP-FPM pre-configured (Menggunakan base image yang sama agar kompatibel)
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

# Allow Composer run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Salin sisa kode PHP/Laravel
COPY . /var/www/html/

# Hapus folder node_modules yang mungkin ada jika Anda menyalin dari root context
RUN rm -rf /var/www/html/node_modules

# Salin aset frontend yang sudah di-build dari 'builder' stage
# Aset Vite/Inertia (manifest.json, css, js) berada di public/build
COPY --from=builder /app/public/build /var/www/html/public/build

# Instal Composer dependencies (non-dev untuk produksi)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions untuk Laravel storage dan bootstrap cache
# Pastikan jalur sudah benar. Biasanya /var/www/html adalah root proyek.
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Jalankan command Artisan (Config, Cache, Migrate)
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan key:generate --no-interaction --force \
    && php artisan migrate --force

# Expose port
EXPOSE 80

# Start script dari image (Nginx + PHP-FPM)
CMD ["/start.sh"]