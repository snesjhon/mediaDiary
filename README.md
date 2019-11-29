# Media Diary

A diary for your movies, tv shows, and books.

---

There's many answers to keeping a list of movies, tv shows, and books -- They're never in a
single collection.

## TODO

### Global

- ~Add actions/reducer using context to change themes, and add list to localstorage.~
- Use `useReducer` hook to remove lots of `useState` from the equation.
- Need to add user to localStorage, so it doesn't keep refreshing
- Add error logging for information

### Search

- ~~Searching for albums doesn't work as expected~~
- ~~Searching for any should be part of the actions and fetching, including dispatching~~

## Logging

- ~For TV it should give the option to display the number of seasons. So during the 'onClick" you can
  get the details for the show, and then it'd just add that information ahead of time instead
  of doing in "onSave"~
- For album, it needs to get the date from an API D:
- TV Season should replace the "current" season if there's an option for it.

### Other

- ~~Selected is not working because we need to remove the selected whenever we close~~
- Create a better save method for all of the media information
- Add better media query throughout app container
- add a progressive image for the preview images
- Add placeholder images for images that don't work
