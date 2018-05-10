Community, please make suggestions to represent your values so we can design as Canonical Books Page everyone is proud of:

**Principles** (for discussion)
1. Our sitemap will index editions
    - Most recently added first
    - 1 edition per language per work, prioritizing books we have digitized?
2. `/works` pages will become a redirect page to an edition (i.e. “canonical book” page). A user will not be able to get to a work page. An edition will always be selected / the destination for viewing book information.
    - redirect to the “best” edition, by default
        - E.g. Borrowable + available, readable, newest, highest rated
        - Can be done dynamically, at time of hitting url
    - Allow default setting to be overridden to accommodate language, or a request for a specific edition
        - A lang= parameter could be used to tell the search results /work which edition to redirect to, i.e. as a filter/facet for desired language
3. All editions will also incorporate work data into their display (i.e. an edition page is basically a work page with an edition selected)
4. To see other editions of a work, we may opt to shown the “best” subset of them (in one more many carousel(s)?) on the selected edition page. Where applicable (i.e. the edition has a work), a user may see a comprehensive listing of all editions (including those without ebooks) by going to: `/works/OL...W/<title>/editions`. In this case, we can guarantee there is a work by virtue of there being multiple editions.
    - “best” may mean the same thing as defined above (e.g. newest, available, languages)
5. For maintainability and clarity, there will be exactly 1 template (disregarding A/B testing) for the “canonical book page”
6. Not all editions need a work under this approach
7. The Canonical Book Page will be mobile responsive and have a mobile + desktop view
8. As a separate (integrally related) issue, solr search should be updated where possible to insert edition match info results to accommodate facet by language, year, etc
9. Separate but related issue: How should search results handle works/editions?

The change requires 5 main pieces:
1. Redirecting `/works/OL...W/<title>` to the "best" *edition* page (definition of "best" to be discussed)
2. Adding `work` data (e.g. `description`, `subject-tags`, other `edition`s) to the *edition* page
3. Overhauling the `Canonical Books Page` (i.e. *edition* page) to have a consistent, mobile friendly design.
4. Creating a new *work's editions* endpoint `/works/OL...W/<title>/editions` as the comprehensive listing of a work's editions.
5. Updating the *sitemap* to include "select" editions per works (spanning languages, availability, favoring recent date-added, etc -- again, to be discussed)

Related:
https://internetarchive.slack.com/archives/C0ETZV72L/p1521771852000004
https://github.com/internetarchive/openlibrary/issues/844
