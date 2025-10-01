FROM rendertemplates/php:8.2-fpm-nginx

# Install dependencies
COPY composer.* ./
RUN composer install --no-dev --optimize-autoloader

# Copy source
COPY . ./

# Build frontend assets
RUN npm ci && npm run build

# Run migrations
RUN php artisan migrate --force

# Generate app key if not exists
RUN php artisan key:generate --force