# fotopia
A process and hopefully some tools to make sense of a chaotic and disorganised photo archive

# the process
## Gathering all the data together
 - old cds
	- dug out an old dvd drive (usb) that I forgot we had
	- in looking at new dvd r drives I noticed a feature where most tvs will auto play - could be an easy way of viewing
 - old hard drive
	- the firewire problem
### Result from all sources:
- ad hoc copying eventuated in 65k photos
- many corrupted files
- in assorted weird folder structures. Often nothing but a file name
- date of files often got screwed up in many backups and transfers.


## The great sorting
### Initial idea:
Use the terminal to analyse the folder and exclude obvious things like
- low file size - probably a thumbnail or corrupted file
- duplicates, exact files size and date (date misleading as could be wrong) partial name match (e.g. one with '-1' on the end)
- then do some more advanced sorting on photo quality.
	- has a person in it
	- sharp edges
	- low file size or low contrast/colour range


### Result
Screw terminal - I don’t want to deal with archaic unix commands nested within backticks - sounds like a nightmare to debug. Instead I will stick with what i know - node (yeah - yeah, if you’ve got a hammer everything looks like a nail…).

## Once chaos is tamed..
Ideas for how to organise
- by people
	- some sort of recogniser lib - all photos of x
- by place
- by time

Database? or static file metadata?
Hosting - S3 ~70Gb will be about $2 per month to host
