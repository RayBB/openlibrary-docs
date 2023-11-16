The following was originally published by Giovanni Damiola @gdamdam via http://gio.blog.archive.org/2016/03/10/ol-anti-spam-tools. Gio writes:

Tools:
* Added “block and revert all edits” button to admin profile page
* Added /admin/spamwords page to mark some words as spam https://openlibrary.org/admin/spamwords
* Also a way to blacklist a domain from /admin/spamwords.
* If the edit to a page contains any of the spam words or email of the user is from the blacklisted domains, the edit won’t be accepted. New registrations with emails from those domains are also not accepted.
* Sam's [DDOS](https://git.archive.org/mek/detect-abuse) tools

Measures taken:
I’ve added the common words found in the recent spam to the spam words blacklisted mail.com as almost all of the spam was coming from that domain. This may stop some genuine people from registering and making edits. blocked and reverted edits lot of accounts

Other approaches:

On `ol-db1` investigate volume and patterns:
- `select * from store where key like 'account/%/verify' order by id desc limit 50;`

Check nginx access logs for common vectoros on `ol-www1`
- `sudo cat /var/log/nginx/access.log | grep "/people"`
- `sudo cat /var/log/nginx/access.log | grep "/account/create"`

Sam's magic sauce:
```
netstat -n | /home/samuel/work/reveal-abuse/mktable
sudo cat /var/log/nginx/access.log | cut -d ' ' -f 1 | sort | uniq -c  | sort -n | tail -n 10 | /home/samuel/work/reveal-abuse/reveal | /home/samuel/work/reveal-abuse/shownames 
```

## Handling DDOS (Denial of Service Attack)

See related outage events: https://github.com/internetarchive/openlibrary/wiki/Disaster-History-Log#2017-11-09-1000pm-pst

In 2023, we hit a case where a set of IPs was rapidly accessing our Books pages on Open Library. We did not have access to Sam's scripts for de-anonymizing IPs to detect abuse. This was the process for resolving the DDOS: https://github.com/internetarchive/openlibrary/issues/8319#issuecomment-1741323936

1. `ssh -A ol-www0`
2. edit `/opt/openlibrary/docker/nginx.conf` to add `($remote_addr)` to the **end** (must be end) of `log_format` in `nginx.conf` to de-anonymize IPs:

```
log_format iacombined '$remote_addr_ipscrub $host $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time IP:$remote_addr';
```

3. `docker restart openlibrary-web_nginx-1`
4. Identify high-volume IPs

```
sudo cat /1/var/log/nginx/access.log | grep "IP:" | awk -F 'IP:' '{print $2}' | sort | uniq -c | sort -rn | head -n 100
``` 

5. Use your discretion to check any given IP to see whether the pattern looks abusive / spammy -- e.g. Internet Archive makes many requests to /api/books.json and still we don't want to ban it. e.g.

```
sudo cat /1/var/log/nginx/access.log | grep "IP:XXX.XXX.XXX.XXX"  # check one IP XXX.XXX.XXX.XXX at a time
sudo cat /1/var/log/nginx/access.log | grep "IP:" | awk -F 'IP:' '{print $2}' | sort | uniq -c | sort -rn | head -n 100 | awk '{print $2}' | sudo xargs -I{} grep {} /1/var/log/nginx/access.log # skim all requests by top 100 requesting IPs
```

6. Add the `deny` rules for individual abusing IPs to /opt/olsystem/etc/deny.conf or update the rules in `/opt/openlibrary/docker/web_nginx.conf` to deny IPs or user-agents in specific cases. Because `deny.conf` is in olsystem, which is volumed mounted, **and** `/opt/openlibrary` is also volume mounted on `ol-www0`, simply restarting docker after changes are made should apply your changes.

7. Undo temporary IP de-anonymization by removing the trailing `IP:$remote_addr'` segment of `/opt/openlibrary/docker/nginx.conf` in the `log_format` rule:

```
log_format iacombined '$remote_addr_ipscrub $host $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time;
```

8. And then restart everything one last time: `docker restart openlibrary-web_nginx-1`

## Using Sam's Legacy Tools
 
First, ssh over to `ol-www0` (which is the entry point for all traffic) and determine who the bad actor(s) are. Because we anonymize IPs, you'll first have to populate a map of anonymous IPs to IPs we can actually block:

```
ssh -A ol-www1
netstat -n | /home/samuel/work/reveal-abuse/mktable  # XXX this should probably be added to `olsystem`, see: https://github.com/internetarchive/olsystem/issues/45
```

Then run:

```
sudo tail -n 5000 /var/log/nginx/access.log | cut -d ' ' -f 1 | sort | uniq -c  | sort -n | tail -n 10 | /home/samuel/work/reveal-abuse/reveal | /home/samuel/work/reveal-abuse/shownames
```

Or...

```
sudo tail -n 250000 /1/var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 30
```

At this point, see [nginx.conf](https://github.com/internetarchive/openlibrary/blob/6216cda55295ed6477439af2791b20df3bdadd9d/docker/nginx.conf#L44-L45), you can add the IPs to /olsystem/etc/nginx/deny.conf or add classes of IPs or user-agents to `/etc/nginx/sites-available/openlibrary.conf`, e.g.:

```
    if ($http_user_agent ~* (Slurp|Yahoo|libwww-perl|Java)) {
        return 403;
    }
```

Or, you can block on a per-IP basis in `/opt/openlibrary/olsystem/etc/nginx/deny.conf`.

