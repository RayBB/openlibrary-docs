The design pattern library, audits all the different types of components that exist in the existing openlibrary codebase.

Eventually, we'd love to move these components to [open library's developer design page](https://openlibrary.org/developers/design).

Inspired by [Wikimedia's style guide]( https://design.wikimedia.org/style-guide/visual-style.html ).

Note: this list is unstable and likely to change at any given time, while we refactor the frontend UI.
If you want to help us document components, please jump in with your image uploads and documenting where these components are in use!

You can also help by contributing to the associated mega-issue [#1092](https://github.com/internetarchive/openlibrary/issues/1092) and making sure the codebase reflects this document.

## Components

These are components on Open Library to be made modular and documented:
### BorrowTable

A table listing 
![BorrowTable](https://user-images.githubusercontent.com/148752/45578856-d4a40b00-b838-11e8-826f-9e54f2051257.png)

Used on the following pages:
* https://openlibrary.org/account/loans

### Carousel
Arrows are fonts rendered via the slick library.

![Carousel](https://user-images.githubusercontent.com/148752/45588422-678c8600-b8c9-11e8-9aaf-daeb1fa1774a.png)

#### Decorated-Carousel
A decorated carousel has background:

![Carousel-decorated](https://user-images.githubusercontent.com/978325/45579855-f81e8400-b83f-11e8-967c-1dd8c07ef575.png)

This is used on [the works page](https://openlibrary.org/works/OL69395W/Historie_of_the_raigne_of_King_Henry_the_Seventh).


#### Carousel-section
A carousel section wraps a carousel and a heading
![Carousel-section](https://user-images.githubusercontent.com/148752/45588442-9efb3280-b8c9-11e8-8b37-7dacb990cdce.png)

### ColorBoxOverlay
An overlay that expands images. Visible when clicking the image of the author on their page.
[Author page](https://openlibrary.org/authors/OL1194994A/Louise_Fitzhugh)

![screen shot 2018-09-15 at 10 46 02 am](https://user-images.githubusercontent.com/148752/45589089-9ceaa100-b8d4-11e8-82b8-e8a13a4c7e3d.png)

Also used when clicking the image of a book cover on a [book page](https://openlibrary.org/works/OL16028308W/Harriet_the_Spy).

![screen shot 2018-09-15 at 10 48 35 am](https://user-images.githubusercontent.com/148752/45589108-08cd0980-b8d5-11e8-9974-4de64f403c9b.png)

Also used when adding an item to a reading list via a Dropper component:
![screen shot 2018-09-19 at 5 32 12 pm](https://user-images.githubusercontent.com/148752/45788898-04d11c80-bc32-11e8-9ca5-864bb08704f6.png)

(Uses rules #colorbox, #cboxOverlay, #cboxWrapper)

### dataTables
(please help document me!)

### Diff
Renders [a diff](https://openlibrary.org/books/OL7500626M/The_Time_Machine?b=9&a=1&_compare=Compare&m=diff)
![screen shot 2018-09-15 at 10 05 48 am](https://user-images.githubusercontent.com/148752/45588767-023b9380-b8cf-11e8-99df-2e0142fd1ef7.png)

### EditionsTable
![EditionsTable](https://user-images.githubusercontent.com/148752/45579776-6c0c5c80-b83f-11e8-968e-ab6e9681caec.png)

#### .lists variant
When inside a .lists element this renders differently.
(please help document me!)

### History
![screen shot 2018-09-15 at 9 47 20 am](https://user-images.githubusercontent.com/148752/45588626-732d7c00-b8cc-11e8-911d-358d86ce04f3.png)

shows at the bottom of the [works page](https://openlibrary.org/works/OL69395W/Historie_of_the_raigne_of_King_Henry_the_Seventh).

#### RevisionHistoryTable
Confusingly, a similar table renders on [the revision history page](https://openlibrary.org/books/OL7500626M/The_Time_Machine?m=history)

![RevisionHistoryTable](https://user-images.githubusercontent.com/148752/45588739-82152e00-b8ce-11e8-8509-451692cfd0e9.png)

### MyBooksList
![MyBooksList](https://user-images.githubusercontent.com/148752/45579534-3cf4eb80-b83d-11e8-9891-167aeca012c7.png)

### OLform
Used to render forms in OpenLibrary
(please help document me!)
Some examples:
- Search at top of [subjects page](https://openlibrary.org/subjects/science)

- the [edit a work page](https://openlibrary.org/works/OL69395W/Historie_of_the_raigne_of_King_Henry_the_Seventh/edit)

![olform](https://user-images.githubusercontent.com/148752/45588481-5132fa00-b8ca-11e8-8028-66a61c79c1db.png)
![edit olform](https://user-images.githubusercontent.com/148752/45588637-9ce6a300-b8cc-11e8-88ce-bdf91f288d40.png)


### readinglog-stats
(please help document me!)


### Books Page

#### Books Actions Menu
![BookActionsMenu](https://user-images.githubusercontent.com/978325/45580136-901d6d00-b842-11e8-8233-14ce3da3babd.png)

### All Pages

#### HeaderBar
The header bar appears at the top of every page.
![HeaderBar](https://user-images.githubusercontent.com/148752/45579420-50538700-b83c-11e8-81c8-02fe4f4bbd09.png)

#### Footer
The footer appears at the top of every page.
![Footer](https://user-images.githubusercontent.com/978325/45580060-bc84b980-b841-11e8-98e1-8041c4d5be60.png)

### RatingsForm
![screen shot 2018-09-15 at 9 43 04 am](https://user-images.githubusercontent.com/148752/45588591-e97dae80-b8cb-11e8-9275-bb4d8e1fd44c.png)

### SearchResultItem
![screen shot 2018-09-15 at 9 44 34 am](https://user-images.githubusercontent.com/148752/45588596-fd291500-b8cb-11e8-9d0a-1508380f00b1.png)

### SearchResultsInstantResult
Shows up when you search from the header
![screen shot 2018-09-15 at 9 45 05 am](https://user-images.githubusercontent.com/148752/45588607-25b10f00-b8cc-11e8-9745-4341af79bb94.png)

### ResultCovers
Similar to [Carousel](#Carousel) but implemented differently using jCarousel.
Renders on the [subjects page](https://openlibrary.org/subjects/science), [borrow page](https://openlibrary.org/borrow)

![ResultsCovers](https://user-images.githubusercontent.com/148752/45588558-72e0b100-b8cb-11e8-8a8f-256e5422a38c.png)

#### StatsChart
Can be found on the home page. Graph rendered via an HTML canvas.

![StatsChart](https://user-images.githubusercontent.com/148752/45588471-29439680-b8ca-11e8-83ae-00ea4f9aa360.png)

### PageBanner
![1](https://user-images.githubusercontent.com/148752/45588543-3745e700-b8cb-11e8-8619-6228788dc7a5.png)
![2](https://user-images.githubusercontent.com/148752/45588544-3745e700-b8cb-11e8-8b83-c8e9026f31f9.png)

### workDetails
(please help document me!)
Appears on [book page](https://openlibrary.org/books/OL1447641M/Women_of_words)

### Tools
(please help document me!)
(Appears on which pages?)

On [works page](https://openlibrary.org/works/OL100238W/The_Titan):
![screen shot 2018-09-18 at 11 01 54 am](https://user-images.githubusercontent.com/148752/45706914-52666000-bb32-11e8-8d7e-89aeaf43a5c5.png)
[pictured: dropit tool] 

### ShareLinks
![screen shot 2018-09-19 at 5 01 42 pm](https://user-images.githubusercontent.com/148752/45788170-c8032680-bc2d-11e8-8821-09d5f614dc28.png)

Appears on [book page](https://openlibrary.org/books/OL23053293M/Ranma_1_2.). I don't believe it appears anywhere else (??)

### Dropper
The dropper is an enhanced substitution `select` element. At time of writing it does not work without JavaScript (see #1147).

![screen shot 2018-09-19 at 5 10 04 pm](https://user-images.githubusercontent.com/148752/45788340-e3bafc80-bc2e-11e8-9ab7-cf1fdef06d19.png)

Dropper with dropdown
![screen shot 2018-09-19 at 5 11 16 pm](https://user-images.githubusercontent.com/148752/45788362-0fd67d80-bc2f-11e8-8981-833512692122.png)

with activated-check
![screen shot 2018-09-19 at 5 11 57 pm](https://user-images.githubusercontent.com/148752/45788381-2f6da600-bc2f-11e8-9ff0-eef3ba1f96fa.png)

When referring to "Drop click" we are referring to this part of the element:
![screen shot 2018-09-19 at 5 16 48 pm](https://user-images.githubusercontent.com/148752/45788524-f1bd4d00-bc2f-11e8-9045-96320b08964d.png)

### WidgetLists
A list of lists.

![screen shot 2018-09-19 at 5 35 55 pm](https://user-images.githubusercontent.com/148752/45789018-81fc9180-bc32-11e8-815e-015c008429d1.png)

(#widget-lists, .listLists)