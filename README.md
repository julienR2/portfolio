# Nowmad server

## Stack

- Supabase - Self hosted with docker
- Server - Express, api to handle custom actions
- Client - React Native Web (Ejected Expo)

## Specific installs

### Mono repo

Eslint, and prettier are handled at the root of the repo.
So we should always run a `npm install` from the root of the project.

### Service

`nowmad.service` is meant to be installed in `systemd`, to be trigger when the server boots.
Few helper scripts (start/install/restart), are set in the `package.json` at the root

### Nginx

We need to handle the following:
- `nowmad.io` serving the server (running on 5000)
- `studio.nowmad.io` displaying Supabase studio to access the DB (running on 3000)
- `supabase.nowmad.io` the supabase instance the client connects to (running on 8000)
- `dev.nowmad.io` to access the server in dev mode

**Certs are handled by Certbox**

So to setup our `/etc/nginx/sites-available/default` Nginx config file, we should do the following (more details on [Certbot website](https://certbot.eff.org/instructions?ws=nginx&os=debianbuster)):
- install nginx `sudo apt install nginx`
- start nginx `sudo /etc/init.d/nginx start`
- install snapd `sudo apt install snapd`
- install snapd tools `sudo snap install core; sudo snap refresh core`
- install Certbot `sudo snap install --classic certbot`
- prepare Certbot command `sudo ln -s /snap/bin/certbot /usr/bin/certbot`
- run Certbox nginx command `sudo certbot --nginx` (better to do each domain one by one)
- test automatic renewal `sudo certbot renew --dry-run`

**Restrict access to studio.nowmad.io**

We restrict the access through the auth feature provided by Nginx. It looks like this:
```
  ...
  auth_basic "Restricted Content";
  auth_basic_user_file /etc/nginx/.htpasswd;
  ...
```

`.htpasswd` is filled up the following way:
- user - `sudo sh -c "echo -n 'user:' >> /etc/nginx/.htpasswd"`
- password - `sudo sh -c "openssl passwd -apr1 >> /etc/nginx/.htpasswd"`

Restart Nginx after modications `sudo systemctl restart nginx`

**See nginx.sample to help setting it up**

### Docker

We use Docker to run some part of the setup (Supabase, see below). So we obviously need it for our setup to work.

Also since Docker can use quite some space, we actually move it to it's own USB key, offering more storage.
⚠️ The USB key must be in ext4 format ! (exfat not compatible)

- Install Docker `curl -sSL https://get.docker.com | sh`
- Add user to docker group `sudo usermod -aG docker $(whoami)`
- Check updated groups by running `groups`
- Stop Docker `service docker stop`
- Specify new location in Docker Daemon config. In `/etc/docker/daemon.json`:
```
{
  "data-root": "/new/location",
  "storage-driver": "overlay2"
}
```
- Copy docker files to new location `rsync -aP /var/lib/docker/ /new/location`
- Remove old directory `rm -rf /var/lib/docker`
- Start daemon `service docker start`
- Testing install `docker run hello-world`


### Supabase

Supabase Docker files are located in [their github](https://github.com/supabase/supabase/tree/master/docker).
Those are the files located locally in `supabase` from which we adjusted the config and triggered a `docker compose up`

### Pupeteer

...