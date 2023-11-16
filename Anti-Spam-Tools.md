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

