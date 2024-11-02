# SeaDex
This repository holds the source code that powers [SeaDex](https://releases.moe/).

# Deployment
To deploy SeaDex, you need [docker](https://docs.docker.com/). SeaDex images are available on [ghcr.io](https://github.com/ThaUnknown/releases-moe/pkgs/container/releases-moe).

```yaml
---
services:
  seadex:
    image: ghcr.io/thaunknown/releases-moe:latest
    container_name: seadex
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
    volumes:
      - /host/path/to/pocketbase/database:/app/pb/pb_data
    ports:
      - 59991:59991
    restart: unless-stopped
```

Once running, you can access SeaDex at `http://localhost:59991`. The admin panel is available at `http://localhost:59991/_/`.

## Discord Authentication

Setting up Discord authentication is required to add, remove, or edit entries.

- Go to https://discord.com/developers/applications.
- Click on `New Application` and give it whatever name you want.
- Go to `OAuth2` on the left pane.
- From `Client information`, copy the `ClIENT ID` and `CLIENT SECRET`.
- In `Redirects`, add `http://localhost:59991/api/oauth2-redirect`.
- Go to http://localhost:59991/_/#/settings/auth-providers, select `Discord`, and paste the `CLIENT ID` and `CLIENT SECRET` you copied earlier.

# Development

[Docker](https://docs.docker.com/) is required for development. Just make your changes to either of these:

- `pb/` - [Pocketbase](https://pocketbase.io/docs/) backend
- `sk/` - [SvelteKit](https://kit.svelte.dev/) frontend

Once you're done making your changes, run `docker compose up -d` to have your local instance up and running.

## License

Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License. See [LICENSE](https://github.com/ThaUnknown/releases-moe/blob/main/LICENSE) for more information.
