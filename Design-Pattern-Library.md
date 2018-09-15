The design pattern library, audits all the different types of components that exist in the existing openlibrary codebase.

Eventually, we'd love to move these components to:
https://openlibrary.org/developers/design

Inspired also by: https://design.wikimedia.org/style-guide/visual-style.html 

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

#### Carousel-section
A carousel section wraps a carousel and a heading
![Carousel-section](https://user-images.githubusercontent.com/148752/45588442-9efb3280-b8c9-11e8-8b37-7dacb990cdce.png)


### dataTables
(please help document me!)

### EditionsTable
![EditionsTable](https://user-images.githubusercontent.com/148752/45579776-6c0c5c80-b83f-11e8-968e-ab6e9681caec.png)

#### .lists variant
When inside a .lists element this renders differently.
(please help document me!)

### MyBooksList
![MyBooksList](https://user-images.githubusercontent.com/148752/45579534-3cf4eb80-b83d-11e8-9891-167aeca012c7.png)

### OLform
(please help document me!)

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

#### StatsChart
Can be found on the home page. Graph rendered via an HTML canvas.
![StatsChart](https://user-images.githubusercontent.com/148752/45588471-29439680-b8ca-11e8-83ae-00ea4f9aa360.png)

