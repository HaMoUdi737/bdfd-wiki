set -e

for file in /*.tar.gz; do
    if ! tar xzf "$file" -C /usr/local/bin; then
        echo "Error: Failed to extract $file" >&2
        exit 1
    fi
    rm "$file"
done

mdbook-admonish install --css-dir src/theme
mdbook serve --port 3000 -n 0.0.0.0
