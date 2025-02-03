# Smule desktop

HEAVY WIP --- HOBBY PROJECT (DO NOT EXPECT MAINTAINANCE)

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
- [ ] Pitch calculation and the other funny stuff that's nice to have
- [ ] Encrypted store with electron's `safeStorage`
- [ ] Automatically trigger `refreshLogin()` once requests start erroring out
- [ ] Combine voice with the song
- [ ] Create new solo / duet / group
- [ ] Uploading recordings to the server
- [ ] Social stuff
- [ ] Explore stuff
- [ ] Account stuff
- [ ] Proper UI
- [ ] Proper documentation
- [ ] Implement pauses between lyrics (`avTmplSegments` from the extended arr)
- [ ] Check whether groups are allowed to choose which side they do or not
- [ ] Eventually reverse engineer the sound filter templates