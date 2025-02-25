# Smule desktop

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

HEAVY WIP --- HOBBY PROJECT

## Motivation

<p>
> be me <br/>
> enjoy karaoke app on phone <br/>
> i want bigger screen <br/>
> smule doesnt support desktop <br/>
> try emulator <br/>
> emulator has UNBEARABLE microphone latency <br/>
> decide to build my own
</p>

on a real note, this is partially just an opportunity for me to learn `electron` + `vite` + `react` + `tailwindcss` in one go, as i'll eventually begin writing more and more (cross-(desktop)-platform) programs every now and again

## Roadmap / TODO list

- [x] Reverse engineer smule's digest system in order to communicate with the server
- [x] Login support
- [x] Play a song
- [x] Play along
- [x] Synced lyrics from smule's main midi file (for non-pitch tracks)
- [x] Song search support and wtv
- [x] Some sort of navigation
- [x] Persistent sessions
- [x] Find out how lyrics for pitch'd songs work
- [x] Find out how parts for lyrics for pitch'd songs work
- [x] Record voice
- [x] Play solo / duet / group WITHOUT recording
- [x] Figure out what causes error 2001 and how to fix it
- [x] Automatically trigger `refreshLogin()` once requests start erroring out
- [x] Pitch track
- [x] Implement pauses between lyrics (`avTmplSegments` from the extended arr)
- [x] View profile
- [x] Implement follow and unfollow apis (im lazy)
- [x] Move one-liner css classes to inline styles
- [x] ~~Pitches may go offscreen~~ (fixed)
- [x] Create new solo / duet / group
- [x] Load sound filter template and file data
- [x] Upload new recordings to the site
- [x] Upload performances to the site
- [ ] Reverse engineer the meta file
- [ ] Apply sound filters and whatever to your recording
- [ ] Pitch calculation and the other funny stuff that's nice to have
- [ ] Encrypted store with electron's `safeStorage`
- [ ] Combine voice with the song
- [ ] Social stuff
- [ ] Chat feature eventually maybe (probably wont)
- [ ] Explore stuff
- [ ] Account stuff
- [ ] Proper UI
- [ ] Proper documentation
- [ ] Implement group part play (we only support part 1 and 2, but we can have up to 8 iirc)
- [ ] Implement group performance part selection
- [ ] Implement group creation part selection
- [ ] Implement performance duet & group part selection (Right now it just selects the part opposite to the original singer)
- [ ] Clean up code
- [ ] Pitch track may still be broken under some songs (for example APT, but why?)
- [ ] Pitch track's first pitch may be marked as next part too late (for example, start of part 1 will have first pitch as last part, and then the rest as part 1)
- [ ] Add `/arr/play` and `/performance/play` calls in order to be able to get future recommendations
- [ ] Implement onUnmount calls for each page / element that needs it
- [ ] Implement ability to upload from the app (currently API only)