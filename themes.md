# Tumblr to Dumblr theme support thing
- [ ] Identify what maps directly and what does not.
- [ ] Adjust Dumblr where necessary.
- [ ] Come up with EJS snippets for each item.

Actual list of items and their descriptions ripped straight from Tumblr's docs.
EJS documentation: https://ejs.co/

## Process

1. Get the blog's theme file, escape all `<%` and `%>` so we can't use EJS *in* the theme.
2. Convert each supported block from `{Tumblr}` to `<%EJS%>`.
3. Pass it to `ejs.render`.

## Basic variables
| Variable | Description | EJS counterpart |
|----------|-------------|----------------|
| `{Title}` | The HTML-safe title of your blog. | `<%=theme['title']%>` |
| `{Description}` | The description of your blog. (may include HTML) | `<%-theme['description']%>` |
| `{MetaDescription}` | The HTML-safe description of your blog. e.g., `<meta name="description" content="{MetaDescription}" />` | `<%=theme['description']%>` |
| `{BlogURL}` | Main URL for your blog. | `http://localhost:3000/<%-theme['handle']%>` |
| `{RSS}` | RSS feed URL for your blog. | |
| `{Favicon}` | Favicon URL for your blog. | |
| `{CustomCSS}` | Any custom CSS code added on your Customize page. | `<%-theme['custom-css']%>` |
| `{block:PermalinkPage}{/block:PermalinkPage}` | Rendered on post permalink pages. Useful for embedding comment widgets | `<% if(single) { %><% } %>` |
| `{block:IndexPage}{/block:IndexPage}` | Rendered on index (post) pages. | `<% if(!single) { %><% } %>` |
| `{block:HomePage}{/block:HomePage}` | Rendered on the main post page. | |
| `{block:PostTitle}{PostTitle}{/block:PostTitle}` | Rendered on permalink pages. (Useful for displaying the current post's title in the page title). Example: `<title>{Title}{block:PostTitle} - {PostTitle}{/block:PostTitle}</title>` | `<% if(single) { %><% } %>` |
| `{block:PostSummary}{PostSummary}{/block:PostSummary}` | Identical to `{PostTitle}`, but will automatically generate a summary if a title doesn't exist. | |
| `{PortraitURL-16}` | Portrait photo URL for your blog. 16-pixels by 16-pixels. | |
| `{PortraitURL-24}` | Portrait photo URL for your blog. 24-pixels by 24-pixels. | |
| `{PortraitURL-30}` | Portrait photo URL for your blog. 30-pixels by 30-pixels. | |
| `{PortraitURL-40}` | Portrait photo URL for your blog. 40-pixels by 40-pixels. | |
| `{PortraitURL-48}` | Portrait photo URL for your blog. 48-pixels by 48-pixels. | |
| `{PortraitURL-64}` | Portrait photo URL for your blog. 64-pixels by 64-pixels. | `/profiles/<%=theme['id']-%>-64.png` |
| `{PortraitURL-96}` | Portrait photo URL for your blog. 96-pixels by 96-pixels. | |
| `{PortraitURL-128}` | Portrait photo URL for your blog. 128-pixels by 128-pixels. | |
| `{CopyrightYears}` | Displays the span of years your blog has existed. | 

### Differences
Mostly just the `PortraitURL` blocks. Right now I have 32, 64, and 150px versions:

| Variable | EJS counterpart |
|----------|---------------- |
| `{PortraitURL-32}` | `/profiles/<%=theme['id']-%>-32.png` |
| `{PortraitURL-64}` | `/profiles/<%=theme['id']-%>-64.png` |
| `{PortraitURL-150}` | `/profiles/<%=theme['id']-%>-150.png` |

This *could* be replaced easily enough. The current dash view uses 64 and 32px versions. I'm thinking 16, 32, 64, and 128, with anything inbetween done in-place. All of that also goes for the various variants below, of course.

## Global appearance
| Variable | Description | EJS counterpart |
|----------|-------------|---------------- |
| `{TitleFont}` | The font used for your blog title. | |
| `{TitleFontWeight}` | The weight of your title font ("normal" or "bold"). | |
| `{BackgroundColor}` | The background color of your blog. | `<%=theme['background-color']%>` |
| `{TitleColor}` | The title color of your blog. | `<%=theme['title-color']%>` |
| `{AccentColor}` | The accent color of your blog. | `<%=theme['accent-color']%>` |
| `{HeaderImage}` | URL of your header image in all its glory. This will always have a value, even if it's a default header image. | `<%=theme['header-image']%>` |
| `{AvatarShape}` | The display shape of your avatar ("circle" or "square"). | |
| `{block:ShowTitle}{/block:ShowTitle}` | Rendered if you have "Show title" enabled. | `<% if(theme['show-title']) { %><% } %>` |
| `{block:HideTitle}{/block:HideTitle}` | Rendered if you have "Show title" disabled. | `<% if(!theme['show-title']) { %><% } %>` |
| `{block:ShowDescription}{/block:ShowDescription}` | Rendered if you have "Show description" enabled. | `<% if(theme['show-description']) { %><% } %>` |
| `{block:HideDescription}{/block:HideDescription}` | Rendered if you have "Show description" disabled. | `<% if(!theme['show-description']) { %><% } %>` |
| `{block:ShowAvatar}{/block:ShowAvatar}` | Rendered if you have "Show avatar" enabled. | `<% if(theme['show-avatar']) { %><% } %>` |
| `{block:HideAvatar}{/block:HideAvatar}` | Rendered if you have "Show avatar" disabled. | `<% if(!theme['show-avatar']) { %><% } %>` |
| `{block:ShowHeaderImage}{/block:ShowHeaderImage}` | Rendered if you have "Show header image" enabled. | `<% if(theme['show-header']) { %><% } %>` |
| `{block:HideHeaderImage}{/block:HideHeaderImage}` | Rendered if you have "Show header image" disabled. | `<% if(!theme['show-header']) { %><% } %>` |

## Navigation 
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Pagination}{/block:Pagination}` | Rendered if there is a "previous" or "next" page. | |
| `{block:PreviousPage}{/block:PreviousPage}` | Rendered if there is a "previous" page (newer posts) to navigate to. | |
| `{block:NextPage}{/block:NextPage}` | Rendered if there is a "next" page (older posts) to navigate to. | |
| `{PreviousPage}` | URL for the "previous" page (newer posts). | |
| `{NextPage}` | URL for the "next" page (older posts). | |
| `{CurrentPage}` | Current page number. | |
| `{TotalPages}` | Total page count. | |
| `{block:SubmissionsEnabled}{/block:SubmissionsEnabled}` | Rendered if Submissions are enabled. | |
| `{SubmitLabel}` | The customizable label for the Submit link. Example: "Submit" | |
| `{block:AskEnabled}{/block:AskEnabled}` | Rendered if asking questions is enabled. | |
| `{AskLabel}` | The customizable label for the Ask link. Example: "Ask me anything" | `<%=theme['ask-label']%>` |

## Jump Pagination
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:JumpPagination length="5"}{/block:JumpPagination}` | Rendered for each page *greater than the **current page** minus one-half **length** up to **current page** plus one-half **length**.* | |
| `{block:CurrentPage}{/block:CurrentPage}` | Rendered when jump page is the current page. | |
| `{block:JumpPage}{/block:JumpPage}` | Rendered when jump page is not the current page. | |
| `{PageNumber}` | Page number for jump page. | |
| `{URL}` | URL for jump page. | 

## Pages
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:HasPages}{/block:HasPages}` | Rendered if you have defined any custom pages. | |
| `{block:Pages}{/block:Pages}` | Rendered for each custom page. | |
| `{URL}` | The URL for this page. | |
| `{Label}` | The label for this page. | 

## Permalink Navigation
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:PermalinkPagination}` | Rendered if there is a "previous" or "next" post. | |
| `{block:PreviousPost}{/block:PreviousPost}` | Rendered if there is a "previous" post to navigate to. | |
| `{block:NextPost}{/block:NextPost}` | Rendered if there is a "next" post to navigate to. | |
| `{PreviousPost}` | URL for the "previous" (newer) post. | |
| `{NextPost}` | URL for the "next" (older) post. | |

## Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Posts}{/block:Posts}` | This block gets rendered for each post in reverse chronological order. The number of posts that appear per-page can be configured in the Customize area for the blog on the Advanced tab. | `<% posts.forEach(function(post) { %><% }); %>` |
| `{block:Posts inlineMediaWidth="500"}{/block:Posts}` | Width for inline media in the post body. Minimum: 250px | |
| `{block:Posts inlineNestedMediaWidth="250"}{/block:Posts}` | Width for inline media in the reblog chain. Minimum: 250px (must be smaller than or same as `inlineMediaWidth`) | |
| `{block:Text}{/block:Text}` | Rendered for Text posts. | `<% if(post['post-type'] === 'text') { %><% } %>` |
| `{block:Photo}{/block:Photo}` | Rendered for Photo posts. | `<% if(post['post-type'] === 'photo') { %><% } %>` |
| `{block:Panorama}{/block:Panorama}` | Rendered for Panorama posts. | |
| `{block:Photoset}{/block:Photoset}` | Rendered for Photoset posts. | `<% if(post['post-type'] === 'photoset') { %><% } %>` |
| `{block:Quote}{/block:Quote}` | Rendered for Quote posts. | `<% if(post['post-type'] === 'quote') { %><% } %>` |
| `{block:Link}{/block:Link}` | Rendered for Link posts. | `<% if(post['post-type'] === 'link') { %><% } %>` |
| `{block:Chat}{/block:Chat}` | Rendered for Conversation posts. | `<% if(post['post-type'] === 'conversation') { %><% } %>` |
| `{block:Audio}{/block:Audio}` | Rendered for Audio posts. | `<% if(post['post-type'] === 'audio') { %><% } %>` |
| `{block:Video}{/block:Video}` | Rendered for Video posts. | `<% if(post['post-type'] === 'video') { %><% } %>` |
| `{block:Answer}{/block:Answer}` | Rendered for Answer posts. | `<% if(post['post-type'] === 'answer') { %><% } %>` |
| `{PostType}` | The name of the current post type. | `<%=post['post-type']%>` |
| `{Permalink}` | The permalink for a post. Example: `"https://sample.tumblr.com/post/123"` | `{BlogURL}/post/<%=post['id']%>` |
| `{RelativePermalink}` | The permalink for a post, but not including the domain. Example: `"/post/123"` | `/post/<%=post['id']%>` |
| `{ShortURL}` | A shorter URL that redirects to this post. Example: `"https://www.tumblr.com/xpv5qtavm"` | |
| `{EmbedUrl}` | URL of the embed page where users can copy the post's embed code. Example: `"https://sample.tumblr.com/post/123/embed"` | |
| `{PostID}` | The numeric ID for a post. Example: `1234567` | `<%=post['id']%>` |
| `{TagsAsClasses}` | An HTML class-attribute friendly list of the post's tags. Example: `"humor office new_york_city"` | |
| `{block:Post[1-15]}{/block:Post[1-15]}` | Rendered for the post at the specified offset. This makes it possible to insert an advertisement or design element in the middle of your posts. | 

## Reblogs
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:NotReblog}{/block:NotReblog}` | Rendered if a post was not reblogged from another post. | |
| `{block:RebloggedFrom}{/block:RebloggedFrom}` | Rendered if a post was reblogged from another post. | |
| `{ReblogParentName}` | The username of the blog this post was reblogged from. | |
| `{ReblogParentTitle}` | The title of the blog this post was reblogged from. | |
| `{ReblogParentURL}` | The URL for the blog this post was reblogged from. | |
| `{ReblogParentPortraitURL-16}` | Portrait photo URL for the blog this post was reblogged from. 16-pixels by 16-pixels. | |
| `{ReblogParentPortraitURL-24}` | Portrait photo URL for the blog this post was reblogged from. 24-pixels by 24-pixels. | |
| `{ReblogParentPortraitURL-30}` | Portrait photo URL for the blog this post was reblogged from. 30-pixels by 30-pixels. | |
| `{ReblogParentPortraitURL-40}` | Portrait photo URL for the blog this post was reblogged from. 40-pixels by 40-pixels. | |
| `{ReblogParentPortraitURL-48}` | Portrait photo URL for the blog this post was reblogged from. 48-pixels by 48-pixels. | |
| `{ReblogParentPortraitURL-64}` | Portrait photo URL for the blog this post was reblogged from. 64-pixels by 64-pixels. | |
| `{ReblogParentPortraitURL-96}` | Portrait photo URL for the blog this post was reblogged from. 96-pixels by 96-pixels. | |
| `{ReblogParentPortraitURL-128}` | Portrait photo URL for the blog this post was reblogged from. 128-pixels by 128-pixels. | |
| `{ReblogRootName}` | The username of the blog this post was created by. | |
| `{ReblogRootTitle}` | The title of the blog this post was created by. | |
| `{ReblogRootURL}` | The URL for the blog this post was created by. | |
| `{ReblogRootPortraitURL-16}` | Portrait photo URL for the blog this post was created by. 16-pixels by 16-pixels. | |
| `{ReblogRootPortraitURL-24}` | Portrait photo URL for the blog this post was created by. 24-pixels by 24-pixels. | |
| `{ReblogRootPortraitURL-30}` | Portrait photo URL for the blog this post was created by. 30-pixels by 30-pixels. | |
| `{ReblogRootPortraitURL-40}` | Portrait photo URL for the blog this post was created by. 40-pixels by 40-pixels. | |
| `{ReblogRootPortraitURL-48}` | Portrait photo URL for the blog this post was created by. 48-pixels by 48-pixels. | |
| `{ReblogRootPortraitURL-64}` | Portrait photo URL for the blog this post was created by. 64-pixels by 64-pixels. | |
| `{ReblogRootPortraitURL-96}` | Portrait photo URL for the blog this post was created by. 96-pixels by 96-pixels. | |
| `{ReblogRootPortraitURL-128}` | Portrait photo URL for the blog this post was created by. 128-pixels by 128-pixels. | |
| `{block:Reblogs}{/block:Reblogs}` | Rendering each reblog in the reblog trail for this post inside this block. | `<% post['reblog-data'].forEach(function(reblog, i) { %><% }); %>` |
| `{block:IsActive}{/block:IsActive}` | Rendered when the blog that made this reblog trail item is active. | |
| `{block:IsDeactivated}{/block:IsDeactivated}` | Rendered when the blog that made this reblog trail item has been deactivated. | |
| `{Username}` | The name of the blog that made this reblog trail item. | `<%=reblog['name']%>` |
| `{Permalink}` | Permalink to this post in the reblog trail. | |
| `{PortraitURL-16}` | Portrait photo URL for the blog in this reblog trail item. 16-pixels by 16-pixels. | |
| `{PortraitURL-24}` | Portrait photo URL for the blog in this reblog trail item. 24-pixels by 24-pixels. | |
| `{PortraitURL-30}` | Portrait photo URL for the blog in this reblog trail item. 30-pixels by 30-pixels. | |
| `{PortraitURL-40}` | Portrait photo URL for the blog in this reblog trail item. 40-pixels by 40-pixels. | |
| `{PortraitURL-48}` | Portrait photo URL for the blog in this reblog trail item. 48-pixels by 48-pixels. | |
| `{PortraitURL-64}` | Portrait photo URL for the blog in this reblog trail item. 64-pixels by 64-pixels. | `/profiles/<%=reblog['id']-%>-64.png` |
| `{PortraitURL-96}` | Portrait photo URL for the blog in this reblog trail item. 96-pixels by 96-pixels. | |
| `{PortraitURL-128}` | Portrait photo URL the blog in this reblog trail item. 128-pixels by 128-pixels. | |
| `{block:isOriginalEntry}{/block:isOriginalEntry}` | Rendered when this reblog trail item is the original post content. | `<% if(i == 0) { %><% } %>` |
| `{Body}` | The HTML content of the reblog trail item. | `<%-markdown(reblog['content'])%>` |

## Text Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Title}{/block:Title}` | Rendered if there is a title for this post. | `<% if(post['title']) { %><% } %>` |
| `{Title}` | The title of this post. | `<%=entities.decode(post['title'])%>` |
| `{Body}` | The content of this post. | `<%-markdown(post['body-text']) %>` |

## Photo Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{PhotoAlt}` | The HTML-safe version of the caption (if one exists) of this post. | |
| `{block:Caption}{/block:Caption}` | Rendered if there is a caption for this post. | |
| `{Caption}` | The caption for this post. | |
| `{block:LinkURL}` | Rendered if this photo has a click-through set. | |
| `{LinkURL}` | A click-through URL for this photo. Defaults to media permalink if one is not set. | |
| `{LinkOpenTag}` | An HTML open anchor-tag including the click-through URL if set. Example: `<a href="https://...">` | |
| `{LinkCloseTag}` | A closing anchor-tag output only if a click-through URL is set. Example: `</a>` | |
| `{PhotoURL-500}` | URL for the photo of this post. No wider than 500-pixels. | |
| `{PhotoWidth-500}` | Width for the 500px size photo. | |
| `{PhotoHeight-500}` | Height for the 500px size photo. | |
| `{PhotoURL-400}` | URL for the photo of this post. No wider than 400-pixels. | |
| `{PhotoWidth-400}` | Width for the 400px size photo. | |
| `{PhotoHeight-400}` | Height for the 400px size photo. | |
| `{PhotoURL-250}` | URL for the photo of this post. No wider than 250-pixels. | |
| `{PhotoWidth-250}` | Width for the 250px size photo. | |
| `{PhotoHeight-250}` | Height for the 250px size photo. | |
| `{PhotoURL-100}` | URL for the photo of this post. No wider than 100-pixels. | |
| `{PhotoWidth-100}` | Width for the 100px size photo. | |
| `{PhotoHeight-100}` | Height for the 100px size photo. | |
| `{PhotoURL-75sq}` | URL for a square version of the photo of this post. 75-pixels by 75-pixels. | |
| `{block:HighRes}{/block:HighRes}` | Rendered if there is a high-res or panorama photo for a post. | |
| `{PhotoURL-HighRes}` | URL for the high-res or panorama sized photo of this post. No wider than 1280px or 2560px respectively. Use `{PhotoURL-1280}, `{PhotoWidth-1280}, and `{PhotoHeight-1280}` to access the 1280 media directly. | |
| `{PhotoWidth-HighRes}` | Width for the high-res size photo. | |
| `{PhotoHeight-HighRes}` | Height for the high-res size photo. | |
| `{block:Exif}{/block:Exif}` | Rendered if this photo has Exif data. | |
| `{block:Camera}{Camera}{/block:Camera}` | Rendered if this photo's Exif data contains camera info. | |
| `{block:Aperture}{Aperture}{/block:Aperture}` | Rendered if this photo's Exif data contains aperture info. | |
| `{block:Exposure}{Exposure}{/block:Exposure}` | Rendered if this photo's Exif data contains exposure info. | |
| `{block:FocalLength}{FocalLength}{/block:FocalLength}` | Rendered if this photo's Exif data contains focal length. | |

## Panorama Posts
The template tags defined for `{block:Photo}` are also available to `{block:Panorama}`, with the following additions:

| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{LinkOpenTag}` | An HTML open anchor-tag with Javascript to activate the Panorama lightbox. | |
| `{LinkCloseTag}` | A closing anchor-tag. | |
| `{PhotoURL-Panorama}` | URL for the panorama photo of this post. These images can be very big. (2560+ pixels wide) | |
| `{PhotoWidth-Panorama}` | Width for the panorama size photo. | |
| `{PhotoHeight-Panorama}` | Height for the panorama size photo. | |

## Photoset Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Caption}{/block:Caption}` | Rendered if there is a caption for this post. | `<% if(post['body-text']) { %><% } %>` |
| `{Caption}` | The caption for this post. | `<%-markdown(post['body-text']) %>`  |
| `{Photoset}` | Embed code for a responsive Photoset that shrinks to fit the container (max. 700-pixels wide). | |
| `{Photoset-700}` | Embed code for a 700-pixel wide photoset. | |
| `{Photoset-500}` | Embed code for a 500-pixel wide photoset. | |
| `{Photoset-400}` | Embed code for a 400-pixel wide photoset. | |
| `{Photoset-250}` | Embed code for a 250-pixel wide photoset. | |
| `{PhotoCount}` | The number of photos in the Photoset. | `<%=post['photos'].length %>` |
| `{PhotosetLayout}` | An integer representation of the Photoset layout. | |
| `{JSPhotosetLayout}` | JavaScript array of the Photoset column counts. | |
| `{block:Photos}{/block:Photos}` | Rendered for each of the Photoset photos. Each contains the same variables as `{block:Photo} | `<% post['photos'].forEach(function(photo, i) { %><% }); %>` |

## Quote Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{Quote}` | The content of this post. | |
| `{block:Source}{/block:Source}` | Rendered if there is a source for this post. | |
| `{Source}` | The source for this post. May contain HTML. | |
| `{Length}` | "short", "medium", or "long", depending on the length of the quote. | |

## Link Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{URL}` | The URL of this post. | |
| `{Name}` | The name of this post. Defaults to the URL if no name is entered. | |
| `{Target}` | Should be included inside the A-tags of Link posts. Output target="_blank" if you've enabled "Open links in new window". | |
| `{block:Host}{/block:Host}` | Rendered if there is a host for this post (if both URL and name exists). | |
| `{Host}` | The host name of the URL, sans 'www'. For example `tumblr.com` | |
| `{block:Thumbnail}{/block:Thumbnail}` | Rendered if there is an image thumbnail for the post. | |
| `{Thumbnail}` | Link thumbnail URL. | |
| `{Thumbnail-HighRes}` | Link high-res thumbnail URL. | |
| `{block:Description}{/block:Description}` | Rendered if there is a description for this post. | |
| `{Description}` | The description for this post. | |
| `{block:Author}{/block:Author}` | Rendered if the post includes an author. | |
| `{Author}` | The linked author's name. | |
| `{block:Excerpt}{/block:Excerpt}` | Rendered if the post includes an excerpt. | |
| `{Excerpt}` | The excerpt for this post. | |

## Chat Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Title}{/block:Title}` | Rendered if there is a title for this post. | |
| `{Title}` | The title of this post. | |
| `{block:Lines}{/block:Lines}` | Rendered for each line of this post. | |
| `{block:Label}{/block:Label}` | Rendered if a label was extracted for the current line of this post. | |
| `{Label}` | The label (if one was extracted) for the current line of this post. | |
| `{Name}` | The username (if one was extracted) for the current line of this post. | |
| `{Line}` | The current line of this post. | |
| `{UserNumber}` | A unique identifying integer representing the user of the current line of this post. | |
| `{Alt}` | "odd" or "even" for each line of this post. | |

## Audio Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Caption}{/block:Caption}` | Rendered if there is a caption for this post. | |
| `{Caption}` | The caption for this post. | |
| `{block:AudioEmbed}{/block:AudioEmbed}` | Rendered if an embedded audio player is available. | |
| `{AudioEmbed}` | Embed-code for the content of this post. Defaults to 500-pixels wide. | |
| `{AudioEmbed-250}` | Embed-code for the content of this post. 250-pixels wide. | |
| `{AudioEmbed-400}` | Embed-code for the content of this post. 400-pixels wide. | |
| `{AudioEmbed-500}` | Embed-code for the content of this post. 500-pixels wide. | |
| `{AudioEmbed-640}` | Embed-code for the content of this post. 640-pixels wide. | |
| `{block:AudioPlayer}{/block:AudioPlayer}` | Rendered if a native audio player is available | |
| `{AudioPlayer}` | Default audio player. | |
| `{RawAudioURL}` | URL for this post's audio file. iPhone Themes only. | |
| `{block:PlayCount}{/block:PlayCount}` | Rendered if there is a play count for the audio. | |
| `{PlayCount}` | The number of times this post has been played. | |
| `{FormattedPlayCount}` | The number of times this post has been played, formatted with commas. e.g., "12,309" | |
| `{PlayCountWithLabel}` | The number of times this post has been played, formatted with commas and pluralized label e.g., "12,309 plays" | |
| `{block:ExternalAudio}{/block:ExternalAudio}` | Rendered if this post uses an externally hosted MP3. Useful for adding a "Download" link | |
| `{ExternalAudioURL}` | The external MP3 URL, if this post uses an externally hosted MP3. | |
| `{block:AlbumArt}{AlbumArtURL}{/block:AlbumArt}` | Rendered if this audio file's ID3 info contains album art. | |
| `{block:Artist}{Artist}{/block:Artist}` | Rendered if this audio file's ID3 info contains the artist name. | |
| `{block:Album}{Album}{/block:Album}` | Rendered if this audio file's ID3 info contains the album title. | |
| `{block:TrackName}{TrackName}{/block:TrackName}` | Rendered if this audio file's ID3 info contains the track name. | |

## Video Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Caption}{/block:Caption}` | Rendered if there is a caption for this post. | |
| `{Caption}` | The caption for this post. | |
| `{Video-700}` | Embed-code for the content of this post. 700-pixels wide. | |
| `{Video-500}` | Embed-code for the content of this post. 500-pixels wide. | |
| `{Video-400}` | Embed-code for the content of this post. 400-pixels wide. | |
| `{Video-250}` | Embed-code for the content of this post. 250-pixels wide. | |
| `{VideoEmbed-700}` | Same as `{Video-700}, but removes the lightbox effect from directly uploaded video. 700-pixels wide. | |
| `{VideoEmbed-500}` | Same as `{Video-500}, but removes the lightbox effect from directly uploaded video. 500-pixels wide. | |
| `{VideoEmbed-400}` | Same as `{Video-400}, but removes the lightbox effect from directly uploaded video. 400-pixels wide. | |
| `{VideoEmbed-250}` | Same as `{Video-250}, but removes the lightbox effect from directly uploaded video. 250-pixels wide. | |
| `{PlayCount}` | The number of times this post has been played. | |
| `{FormattedPlayCount}` | The number of times this post has been played, formatted with commas. e.g., "12,309" | |
| `{PlayCountWithLabel}` | The number of times this post has been played, formatted with commas and pluralized label e.g., "12,309 plays" | |
| `{block:VideoThumbnail}{VideoThumbnailURL}{/block:VideoThumbnail}` | Rendered if there is a video thumbnail available. | |
| `{block:VideoThumbnails}{VideoThumbnailURL}{/block:VideoThumbnails}` | Rendered for each video thumbnail when there are multiple. | |

## Answer Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{Question}` | The question for this post. May contain heavily filtered HTML | |
| `{Answer}` | The answer for this post. May contain HTML | |
| `{Asker}` | Simple HTML text link with the asker's username and URL, or the plain text string "Anonymous". | |
| `{AskerPortraitURL-16}` | Portrait photo URL for the asker. 16-pixels by 16-pixels. | |
| `{AskerPortraitURL-24}` | Portrait photo URL for the asker. 24-pixels by 24-pixels. | |
| `{AskerPortraitURL-30}` | Portrait photo URL for the asker. 30-pixels by 30-pixels. | |
| `{AskerPortraitURL-40}` | Portrait photo URL for the asker. 40-pixels by 40-pixels. | |
| `{AskerPortraitURL-48}` | Portrait photo URL for the asker. 48-pixels by 48-pixels. | |
| `{AskerPortraitURL-64}` | Portrait photo URL for the asker. 64-pixels by 64-pixels. | |
| `{AskerPortraitURL-96}` | Portrait photo URL for the asker. 96-pixels by 96-pixels. | |
| `{AskerPortraitURL-128}` | Portrait photo URL for the asker. 128-pixels by 128-pixels. | |
| `{block:Answerer}{/block:Answerer}` | Rendered if post contains a reblogged answer. | |
| `{Answerer}` | Simple HTML text link with the reblogged answerer's username and URL. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{AnswererPortraitURL-16}` | Portrait photo URL for the reblogged answerer. 16-pixels by 16-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged.') | |
| `{AnswererPortraitURL-24}` | Portrait photo URL for the reblogged answerer. 24-pixels by 24-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{AnswererPortraitURL-30}` | Portrait photo URL for the reblogged answerer. 30-pixels by 30-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{AnswererPortraitURL-40}` | Portrait photo URL for the reblogged answerer. 40-pixels by 40-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{AnswererPortraitURL-48}` | Portrait photo URL for the reblogged answerer. 48-pixels by 48-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{AnswererPortraitURL-64}` | Portrait photo URL for the reblogged answerer. 64-pixels by 64-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{AnswererPortraitURL-96}` | Portrait photo URL for the reblogged answerer. 96-pixels by 96-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{AnswererPortraitURL-128}` | Portrait photo URL for the reblogged answerer. 128-pixels by 128-pixels. Only exists within `{block:Answerer}{/block:Answerer}` and if post has been reblogged. | |
| `{Replies}` | Reblog chain. If not a reblog `{Replies}` is an alias for `{Answer}` | |

## Dates
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Date}{/block:Date}` | Rendered for all posts. Always wrap dates in this block so they will be properly hidden on non-post pages. | |
| `{block:NewDayDate}{/block:NewDayDate}` | Rendered for posts that are the first to be listed for a given day. | |
| `{block:SameDayDate}{/block:SameDayDate}` | Rendered for subsequent posts listed for a given day. | |
| `{DayOfMonth}` | "1" to "31" | |
| `{DayOfMonthWithZero}` | "01" to "31" | |
| `{DayOfWeek}` | "Monday" through "Sunday" | |
| `{ShortDayOfWeek}` | "Mon" through "Sun" | |
| `{DayOfWeekNumber}` | "1" through "7" | |
| `{DayOfMonthSuffix}` | "st", "nd", "rd", "th" | |
| `{DayOfYear}` | "1" through "365" | |
| `{WeekOfYear}` | "1" through "52" | |
| `{Month}` | "January" through "December" | |
| `{ShortMonth}` | "Jan" through "Dec" | |
| `{MonthNumber}` | "1" through "12" | |
| `{MonthNumberWithZero}` | "01" through "12" | |
| `{Year}` | "2007" | |
| `{ShortYear}` | "07" | |
| `{AmPm}` | "am" or "pm" | |
| `{CapitalAmPm}` | "AM" or "PM" | |
| `{12Hour}` | "1" through "12" | |
| `{24Hour}` | "0" through "23" | |
| `{12HourWithZero}` | "01" through "12" | |
| `{24HourWithZero}` | "00" through "23" | |
| `{Minutes}` | "0" through "59" | |
| `{Seconds}` | "0" through "59" | |
| `{Beats}` | "0" through "999" | |
| `{Timestamp}` | "1172705619" | |
| `{TimeAgo}` | A contextual time. e.g., "1 minute ago", "2 hours ago", "3 weeks ago", etc. | |

## Notes
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:PostNotes}{/block:PostNotes}` | Rendered on permalink pages if this post has notes. | |
| `{PostNotes}` | Standard HTML output of this post's notes. Only rendered on permalink pages. | |
| `{PostNotes-16}` | Standard HTML output of this post's notes with 16x16 sized avatars. Only rendered on permalink pages. | |
| `{PostNotes-64}` | Standard HTML output of this post's notes with 64x64 sized avatars. Only rendered on permalink pages. | |
| `{block:NoteCount}{/block:NoteCount}` | Rendered if this post has notes. Always wrap note counts in this block so they will be properly hidden on non-post pages. | |
| `{NoteCount}` | The number of this post's notes. | |
| `{NoteCountWithLabel}` | The number of this post's notes with pluralized label. e.g., "24 notes" | |

## Tags
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:HasTags}{/block:HasTags}` | Rendered inside `{block:Posts}` if post has tags. | `<% if(post['tags'].length) { %><% } %>` |
| `{block:Tags}{/block:Tags}` | Rendered for each of a post's tags. | `<% post['tags'].forEach(function(tag) { %><% }); %>` |
| `{Tag}` | The name of this tag. | `<%=tag[0]%>` |
| `{URLSafeTag}` | A URL safe version of this tag. | `<%=tag[1]%>` |
| `{TagURL}` | The tag page URL with other posts that share this tag. | |
| `{TagURLChrono}` | The tag page URL with other posts that share this tag in chronological order. | |

## Content Sources
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:ContentSource}{/block:ContentSource}` | Rendered if a source is specified for a post's content. | |
| `{SourceURL}` | URL of the attributed source. | |
| `{block:SourceLogo}{/block:SourceLogo}` | Rendered if a logo exists for the content source. | |
| `{BlackLogoURL}` | URL of the source's logo. | |
| `{LogoWidth}` | Width of the source's logo. | |
| `{LogoHeight}` | Height of the source's logo. | |
| `{SourceTitle}` | Title of the content source. | |
| `{block:NoSourceLogo}{/block:NoSourceLogo}` | Rendered if no source logo exists. | |

## Submissions
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Submission}{/block:Submission}` | Rendered if a post is a submission. | |
| `{Submitter}` | The name of the submitting blog. | |
| `{SubmitterURL}` | URL to submitter's blog. | |
| `{SubmitterPortraitURL-16}` | Portrait photo URL for the submitter. 16-pixels by 16-pixels. | |
| `{SubmitterPortraitURL-24}` | Portrait photo URL for the submitter. 24-pixels by 24-pixels. | |
| `{SubmitterPortraitURL-30}` | Portrait photo URL for the submitter. 30-pixels by 30-pixels. | |
| `{SubmitterPortraitURL-40}` | Portrait photo URL for the submitter. 40-pixels by 40-pixels. | |
| `{SubmitterPortraitURL-48}` | Portrait photo URL for the submitter. 48-pixels by 48-pixels. | |
| `{SubmitterPortraitURL-64}` | Portrait photo URL for the submitter. 64-pixels by 64-pixels. | |
| `{SubmitterPortraitURL-96}` | Portrait photo URL for the submitter. 96-pixels by 96-pixels. | |
| `{SubmitterPortraitURL-128}` | Portrait photo URL for the submitter. 128-pixels by 128-pixels. | |

## Group Blogs
### Group Members
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:GroupMembers}{/block:GroupMembers}` | Rendered on additional public group blogs. | |
| `{block:GroupMember}{/block:GroupMember}` | Rendered for each additional public group blog member. | |
| `{GroupMemberName}` | The username of the member's blog. | |
| `{GroupMemberTitle}` | The title of the member's blog. | |
| `{GroupMemberURL}` | The URL for the member's blog. | |
| `{GroupMemberPortraitURL-16}` | Portrait photo URL for the member. 16-pixels by 16-pixels. | |
| `{GroupMemberPortraitURL-24}` | Portrait photo URL for the member. 24-pixels by 24-pixels. | |
| `{GroupMemberPortraitURL-30}` | Portrait photo URL for the member. 30-pixels by 30-pixels. | |
| `{GroupMemberPortraitURL-40}` | Portrait photo URL for the member. 40-pixels by 40-pixels. | |
| `{GroupMemberPortraitURL-48}` | Portrait photo URL for the member. 48-pixels by 48-pixels. | |
| `{GroupMemberPortraitURL-64}` | Portrait photo URL for the member. 64-pixels by 64-pixels. | |
| `{GroupMemberPortraitURL-96}` | Portrait photo URL for the member. 96-pixels by 96-pixels. | |
| `{GroupMemberPortraitURL-128}` | Portrait photo URL for the member. 128-pixels by 128-pixels. | |

### Post Authors
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{PostAuthorName}` | The username of the author of a post to an additional group blog. | |
| `{PostAuthorTitle}` | The title of the author's blog for a post to an additional group blog. | |
| `{PostAuthorURL}` | The blog URL for the author of a post to an additional group blog. | |
| `{PostAuthorPortraitURL-16}` | The portrait photo URL for the author of a post to an additional group blog. 16-pixels by 16-pixels. | |
| `{PostAuthorPortraitURL-24}` | The portrait photo URL for the author of a post to an additional group blog. 24-pixels by 24-pixels. | |
| `{PostAuthorPortraitURL-30}` | The portrait photo URL for the author of a post to an additional group blog. 30-pixels by 30-pixels. | |
| `{PostAuthorPortraitURL-40}` | The portrait photo URL for the author of a post to an additional group blog. 40-pixels by 40-pixels. | |
| `{PostAuthorPortraitURL-48}` | The portrait photo URL for the author of a post to an additional group blog. 48-pixels by 48-pixels. | |
| `{PostAuthorPortraitURL-64}` | The portrait photo URL for the author of a post to an additional group blog. 64-pixels by 64-pixels. | |
| `{PostAuthorPortraitURL-96}` | The portrait photo URL for the author of a post to an additional group blog. 96-pixels by 96-pixels. | |
| `{PostAuthorPortraitURL-128}` | The portrait photo URL for the author of a post to an additional group blog. 128-pixels by 128-pixels. | |

## Day Pages
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:DayPage}{/block:DayPage}` | Rendered on day pages. | |
| `{block:DayPagination}{/block:DayPagination}` | Rendered if there is a "previous" or "next" day page. | |
| `{block:PreviousDayPage}{/block:PreviousDayPage}` | Rendered if there is a "previous" day page to navigate to. | |
| `{block:NextDayPage}{/block:NextDayPage}` | Rendered if there is a "next" day page to navigate to. | |
| `{PreviousDayPage}` | URL for the "previous" day page. | |
| `{NextDayPage}` | URL for the "next" day page. | |

## Tag Pages
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:TagPage}{/block:TagPage}` | Rendered on tag pages. | |
| `{Tag}` | The name of this tag. | |
| `{URLSafeTag}` | A URL safe version of this tag. | |
| `{TagURL}` | The tag page URL with other posts that share this tag. | |
| `{TagURLChrono}` | The tag page URL with other posts that share this tag in chronological order. | |

## Search
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{SearchQuery}` | The current search query. | |
| `{URLSafeSearchQuery}` | A URL-safe version of the current search query for use in links and Javascript. | |
| `{block:SearchPage}` | Rendered on search pages. | |
| `{SearchResultCount}` | The number of results returned for the current search query. | |
| `{block:NoSearchResults}` | Rendered if no search results were returned for the current search query. | |

## Following
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Following}{/block:Following}` | Rendered if you're following other blogs. | |
| `{block:Followed}{/block:Followed}` | Rendered for each blog you're following. | |
| `{FollowedName}` | The username of the blog you're following. | |
| `{FollowedTitle}` | The title of the blog you're following. | |
| `{FollowedURL}` | The URL for the blog you're following. | |
| `{FollowedPortraitURL-16}` | Portrait photo URL for the blog you're following. 16-pixels by 16-pixels. | |
| `{FollowedPortraitURL-24}` | Portrait photo URL for the blog you're following. 24-pixels by 24-pixels. | |
| `{FollowedPortraitURL-30}` | Portrait photo URL for the blog you're following. 30-pixels by 30-pixels. | |
| `{FollowedPortraitURL-40}` | Portrait photo URL for the blog you're following. 40-pixels by 40-pixels. | |
| `{FollowedPortraitURL-48}` | Portrait photo URL for the blog you're following. 48-pixels by 48-pixels. | |
| `{FollowedPortraitURL-64}` | Portrait photo URL for the blog you're following. 64-pixels by 64-pixels. | |
| `{FollowedPortraitURL-96}` | Portrait photo URL for the blog you're following. 96-pixels by 96-pixels. | |
| `{FollowedPortraitURL-128}` | Portrait photo URL for the blog you're following. 128-pixels by 128-pixels. | |

## Likes
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:Likes}{/block:Likes}` | Rendered if you are sharing your likes. | |
| `{Likes}` | Standard HTML output of your likes. | |
| `{Likes limit="5"}` | Standard HTML output of your last 5 likes. Maximum: 10 | |
| `{Likes width="200"}` | Standard HTML output of your likes with Audio and Video players scaled to 200-pixels wide. Scale images with CSS max-width or similar. | |
| `{Likes summarize="100"}` | Standard HTML output of your likes with text summarized to 100-characters. Maximum: 250 | |

## Like and Reblog buttons
### Like Button
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{LikeButton}` | Default Like button. | |
| `{LikeButton color="grey"}` | Like button color. Grey, White, or Black. Like button will always be red if visitor has liked the post. | |
| `{LikeButton size="20"}` | Like button size. Maximum: 100 | |

### Reblog Button
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{ReblogButton}` | Default Reblog button. | |
| `{ReblogButton color="grey"}` | Reblog button color. Grey, White, or Black. | |
| `{ReblogButton size="20"}` | Reblog button size. Maximum: 100 | |

## Related Posts
| Variable | Description | EJS counterpart |
|----------|-------------|-----------------|
| `{block:RelatedPosts}{/block:RelatedPosts}` | Rendered on permalink pages. Shows related posts using post type, content, and tags as reference. Follows the same format as the Posts block. | |
