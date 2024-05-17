A great way to examine a large amount of the openlibrary data at once is to use the monthly data dumps. But these can be a bit obscure if you've never seen them before and aren't familiar with some standard command line tools for dealing with text files and json. This is a very brief introduction with some examples, but these tools are widely used and there are lots of resources available to learn more about them on the internet, so we'll try to stick to the basics.

For those that are familiar with command line tools, the general approach is to use `zgrep` (or similar) to select only the lines we care about in the compressed data, without actually decompressing it. We can then pipe the output to `cut` to extract the json data from the end of the line, and then use `jq` to query the data about the author held within each line in a structured fashion. We'll go over that in a bit more detail and then list some example command lines to give examples of the kind of thing you can do with the data.

Start by downloading the latest authors dump which is the smallest of the files available from https://openlibrary.org/developers/dumps. The same principle will apply to the other dumps, but we'll use examples from the smallest to get started.

The author dump is currently .4Gb in size while compressed for download, which would increase to 3Gb if you uncompress it. But there's no need to do that, so just download it and keep it compressed as a txt.gz file. The file will have a name similar to `ol_dump_authors_latest.txt.gz` but for the following examples we'll rename the file to `a.txt.gz` for brevity.

We don't need to uncompress the file because each entry is on it's own line, and we can extract the lines we are interested in without decompressing first. The standard tool for this is `zgrep`, but I'm going to write these examples to use a tool called `ripgrep` (usually just `rg` when using it) instead. This is partly because it's a slightly simpler and faster approach for those using Windows and Mac OS X who probably need more help with this, and partly because it's what I use for these kind of tasks anyway. You'll need to Install that and `jq`, windows users may need to install a few other things as well as we go.

The basic command for seaching is `rg -z 'Maurice Sendak' a.txt.gz`, which tells `rg` to search through a compressed file for a quoted phrase in the named file. Every line of the a.txt.gz file that matches will be output to the terminal.

There's currently 8487789 lines in the file, and it'll probably continue to grow, so a search even for a relatively unusual single name like Kardashian, Cumberbatch or Humperdinck is going to return quite a few matches, so you may want to use full names and the `-m5` option to limit the number of returns to the first 5  it finds to start with.

If you search for any of the required items that appear on every line (key, type, author, revision and so on) the entire 3GB file will be outputted. Try `-c` to just get a count of how many lines match.

`rg -z -c type a.txt.gz`

This takes about 5 seconds to complete on my laptop. The amount of data that comes back from most useful queries is overwhelming so we'll want to limit it further. You'll have noticed if you ran the `Maurice Sendak` search above, that it returned every line with that name on it. This includes his OpenLibrary author ID (OL366346A) and some data about his wikipedia page etc. but it also returned lines from people who mention being influenced by him in their bio and author's that collaborated with him. The first search is to cut things down to a reasonably size but then we want to be more specific with the shortlist of possible entries returned.

`rg -z 'Maurice Sendak' a.txt.gz | cut -f5 | jq .name`

Should extract the 5th item on each line, which is the data in a json format, then jq will print only the name from each entry.

That's the basics, there's a whole world of things you can do with these tools (e.g. jq will let you turn the json into .CSV files if that's necessary for any of your usual workflows) here's an Open Access introduction to the tool, aimed at Historians, that covers it in detail: https://programminghistorian.org/en/lessons/json-and-jq#output-a-csv-csv

In particular the jqplay tool they talk about, seems very powerful for learning how it works. Pasting a few lines worth of openlibrary data into there should make it a lot faster to get up to speed than just trying things on the command line with a giant file. And you can share snippets:

https://jqplay.org/s/NIq_Aku18p

I'm hoping people will expand this page with worked examples for tasks they find useful for their own open library related tasks, and I'll try to cover some more topics in future like:

https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md#common-options 

case insensitive searches: `rg -z -i 'irvine welsh' a.txt.gz`

Useful regular expressions for matching things that can vary slightly in spelling, and using `-o` to only output the bits that match

only outputting the lines that don't match `-v`

Using `-w` to only match "word boundaries"

Searching for weird typographical characters using `-F`

https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md#common-options 

Sorting, counting and doing set operations on the output (e.g. how many people have wikidata IDs but no viaf id)

Advanced use of jq query language.


