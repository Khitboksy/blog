---
title: Element Test
date: 1969-07-20
hidden: true
description: A showcase of the "blog rice"
tags:
  - meta
---

## Headers

```
# h1 Header

## h2 Header

### h3 Header

#### h4 Header

##### h5 Header

###### h6 Header
```

# h1 Header

## h2 Header

### h3 Header

#### h4 Header

##### h5 Header

###### h6 Header

## Emphasis

Due to my formatter, the below listed emphasis is all i can save

```
This is an emphasis example: Italics with _underscores_, bold with **asterisks**,
combined with _**both**_, and strikethrough text with ~tildes~

_This is Italic Text_
**This is Bold Text**
**_This is Combined Text_**

~This is struck out text~
_~This is an italic strike out~_
**~This is a bold strike out~**
**_~This is a combined strike out~_**
```

This is an emphasis example: Italics with _underscores_, bold with **asterisks**,
combined with _**both**_, and strikethrough text with ~tildes~

_This is Italic Text_  
**This is Bold Text**  
**_This is Combined Text_**

~This is struck out text~  
_~This is an italic strike out~_  
**~This is a bold strike out~**  
**_~This is a combined strike out~_**

## Lists

```
- Unordered list item
- Another item
  - Nested sub-list
  - Another nested item
    - Deeper nesting

1. Ordered list item
2. Another item
   1. Ordered sub-list
   2. Another sub-item

- [x] Finished task
- [ ] Unfinished task
- [x] Tasks support **formatting** and `inline code`
```

- Unordered list item
- Another item
  - Nested sub-list
  - Another nested item
    - Deeper nesting

1. Ordered list item
2. Another item
   1. Ordered sub-list
   2. Another sub-item

- [x] Finished task
- [ ] Unfinished task
- [x] Tasks support **formatting** and `inline code`

## Media

### Tooltips

Hover (tap on mobile) the trigger text to see a plain text tooltip.

```md
<span class="tooltip" context="This tooltip is just extra stuff."

> Hover me</span
```

<span class="tooltip" context="This tooltip is just extra stuff.">
  Hover me
</span>

### Audio

The inline player is a full audio player with cover art, seek bar, and volume.
Hover the purple trigger text to preview a track in a floating minibar, and
click to pin it open.

```md
<div
  class="audio-player"
  data-src="/blog/media/audio/purple-hint.opus"
  data-label="purple hint -- demo track"
></div>

<span
class="tooltip-media"
data-src="/blog/media/audio/albums/tfgba/07.calico.opus"
data-cover="/blog/media/audio/albums/covers/tfgba-cover.jpg"
data-short-label="glass beach | the first glass beach album -- calico"

> Hover for audio preview
> </span>
```

<div class="audio-player"
  data-src="/blog/media/audio/purple-hint.opus"
  data-label="purple hint -- demo track">
</div>

<span class="tooltip-media"
  data-src="/blog/media/audio/albums/tfgba/07.calico.opus"
  data-cover="/blog/media/audio/albums/covers/tfgba-cover.jpg"
  data-short-label="glass beach | the first glass beach album -- calico">
Hover for audio preview
</span>

### Images

Standard markdown images render inline. Hover the trigger text to preview an image in a floating popup.

```
![Demo image](/blog/media/audio/albums/covers/tfgba-cover.jpg)

<span class="tooltip-media" mediaType="image" data-src="/blog/media/audio/albums/covers/tfgba-cover.jpg">Hover for image preview</span>
```

![Demo image](/blog/media/audio/albums/covers/tfgba-cover.jpg)

<span class="tooltip-media" mediaType="image" data-src="/blog/media/audio/albums/covers/tfgba-cover.jpg">Hover for image preview</span>

## Code / Syntax Highlighting

Inline `code` uses the terminal font. Fenced blocks are syntax highlighted via Shiki with the Catppuccin Mocha theme. Hover a block to reveal the copy button.

````
`inline code` looks like this

```nix
{ pkgs, ... }: {
  environment.systemPackages = with pkgs; [
    vim
    git
  ];
}
```

```rust
fn greet(name: &str) -> String {
    format!("hello, {name}")
}
```

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function fetchUser(id: number): Promise<Result<User>> {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(res.statusText);
    return { ok: true, value: await res.json() };
  } catch (error) {
    return { ok: false, error };
  }
}
```
````

`inline code` looks like this

```nix
{ pkgs, ... }: {
  environment.systemPackages = with pkgs; [
    vim
    git
  ];
}
```

```rust
fn greet(name: &str) -> String {
    format!("hello, {name}")
}
```

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function fetchUser(id: number): Promise<Result<User>> {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(res.statusText);
    return { ok: true, value: await res.json() };
  } catch (error) {
    return { ok: false, error };
  }
}
```

## Blockquotes / Callouts

### Blockquotes

```
> Blockquotes get a mauve bar and italic text.

> They can also be **nested**:
>
> > like this, with the inner quote indented further.
```

> Blockquotes get a mauve bar and italic text.

> They can also be **nested**:
>
> > like this, with the inner quote indented further.

### Quoteboxes

Quoteboxes are collapsible — click the label to expand or collapse the quoted content.

```md
<details class="qb">
  <summary data-label="Expand the quotebox"></summary>

> This is a collapsible quotebox. It stays collapsed until the reader clicks
> the label.

</details>
```

<details class="qb">
<summary data-label="Expand the quotebox"></summary>

> This is a collapsible quotebox. It stays collapsed until the reader clicks
> the label.

</details>

### Callouts

Callouts are non-collapsible notice boxes. The label and left bar color match;
the body text stays bold yellow. The `color` attribute overrides the bar and label.

```md
<aside class="callout cw" data-label="Content Warning">
  Suicidal Ideation, Self Harm, General Dysphoria.
</aside>

<aside class="callout warn" data-label="Disclaimer">
  This is a disclaimer callout.
</aside>

<aside class="callout note" data-label="Note">
  This is the default teal note callout.
</aside>

<aside class="callout note" data-label="Custom Note" color="mauve">
  This note overrides the bar and label color.
</aside>

<aside class="callout dedication">
  This is a dedication callout with no label. Each paragraph gets a grey dash
  prefix.
</aside>
```

<aside class="callout cw" data-label="Content Warning">
Suicidal Ideation, Self Harm, General Dysphoria.
</aside>

<aside class="callout warn" data-label="Disclaimer">
This is a disclaimer callout.
</aside>

<aside class="callout note" data-label="Note">
This is the default teal note callout.
</aside>

<aside class="callout note" data-label="Custom Note" color="mauve">
This note overrides the bar and label color.
</aside>

<aside class="callout dedication">

This is a dedication callout with no label.

Each paragraph gets a grey dash prefix.

</aside>

## Tables

```
| Left-aligned  | Center-aligned | Right-aligned |
| :------------ | :------------: | ------------: |
| col 3 is      |    centered    |         $1600 |
| col 2 is      |    centered    |           $12 |
| zebra stripes |    are neat    |            $1 |

| Element        | Example          |
| -------------- | ---------------- |
| \*\*bold\*\*   | **this is bold** |
| \_italic\_     | _this is italic_ |
| \`code\`       | `inline code`    |
| \~\~strike\~\~ | ~~struck out~~   |
```

| Left-aligned  | Center-aligned | Right-aligned |
| :------------ | :------------: | ------------: |
| col 3 is      |    centered    |         $1600 |
| col 2 is      |    centered    |           $12 |
| zebra stripes |    are neat    |            $1 |

| Element        | Example          |
| -------------- | ---------------- |
| \*\*bold\*\*   | **this is bold** |
| \*italic\*     | _this is italic_ |
| \`code\`       | `inline code`    |
| \~\~strike\~\~ | ~~struck out~~   |
