


# When not to use Vue

In general, the Open Library website tries to work for fundamental use cases (e.g. borrowing, want to read button, search) without any modern browser enhancements or javascript. The rational is, the website should work for as many people as possible. By focusing on a non-js experience by default, it forces us to leverage basic html patterns and make sure that we have well defined APIs that the front-end is POSTing or GETting to/from. In general, other than the Library Explorer experience (which is a self-contained demo) and the librarian merge UI, we don't build core pages in vue and vue is typically used as a progressive enhancement (in a way that graceful degrades when a patron doesn't have javascript, so the rest of the page works).

# When to use Vue

Some website features are non-essential enhancements (like the Read Stats) whose very purpose is to present a view in a rich way using javascript. Also, some components/widgets for specific audiences, like our librarian tools, may enable advanced functionality that is made much easier using js + vue.

# How To

To be continued!

# History

As of 2023-02-15, we began migrating from vue 2 -> 3 and there are technical consequences of this which will be documented here. We'll also link to the issue documenting this migration.
