# phopro
Image file processor to create a directory tree of files based on year, month, and day

## Options
| Flag | Description |
|---------------|-----------------------------------------------------|
| --dir, -d     | Sets the input directory (required)                 |
| --output, -o  | Sets the output directory (defaults to 'out')       |
| --usedays, -u | Puts images in /yyyy/mm/dd instead of just /yyyy/mm |
| --verbose, -v | Console.log each filename as it's processed         |

## Todo

* Restrict to image files, maybe just JPGs
* Add option to move rather than copy
* Add option to move images without Exif CreateDate to a separate folder for later review
* Profile memory usage and optimise