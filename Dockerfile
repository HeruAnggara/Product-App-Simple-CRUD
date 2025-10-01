# Base image: Nginx + PHP-FPM pre-configured untuk Laravel
FROM richarvey/nginx-php-fpm:latest

# Copy source code
COPY . .

# Image config (dari richarvey image docs)
ENV SKIP_COMPOSER 1  # Skip Composer jika sudah di-build
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

# Install Composer dependencies (non-dev untuk production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node.js dependencies dan build frontend assets (Inertia React + Tailwind)
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npm ci --only=production
RUN npm run build
RUN apt-get purge -y nodejs && rm -rf /var/lib/apt/lists/*

# Permissions untuk Laravel storage dan bootstrap cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Run Laravel migrations (force untuk production)
RUN php artisan migrate --force

# Generate app key jika belum ada
RUN php artisan key:generate --no-interaction --force

# Cache config, routes, views untuk performa
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Expose port (Render akan handle $PORT)
EXPOSE 80

# Start script dari image (Nginx + PHP-FPM)
CMD ["/start.sh"]