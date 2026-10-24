# Shared website tags

Use one set of tags across interviews, articles, blog posts, research, projects, publications, talks and courses. The registry is `src/data/tags.json`. This file is its human-readable guide. The vocabulary is a review draft and can be extended deliberately when a real article needs a missing topic.

The repository currently has 36 distinct tag labels and no central registry. Every existing label maps to this vocabulary. Existing content is unchanged: aliases document how to consolidate it when tag browsing is implemented. TV means Television, Experiments maps to Experimentation, and differences in capitalization do not create new tags.

## Proposed vocabulary

These groups only organize this reference list. They are not separate categories or additional frontmatter fields: an article has one flat `tags` list.

| Reference group | Canonical tags |
| --- | --- |
| Format | Interview, Review, Feature, Opinion, Personal Essay, Set Visit, News, Research, Publication, Dissertation, Talk, Workshop, Course, Project |
| Culture and journalism | Culture, Media, Film, Television, Music, Theatre, Art, Design, Fashion, Books, Comedy, Reality Television, Journalism, LGBTQ+, Politics, Travel, Spirituality, Gender, Aging, Social Media |
| Research, teaching and professional topics | AI, Generative AI, AI Ethics, AI Literacy, HCI, UX, UX Research, Product Design, Content Strategy, Computational Linguistics, NLP, Information Behavior, Information Engagement, User Engagement, Decision-Making, Consumer Behavior, Marketing, Transparency, Digital Citizenship, Teaching, Education, Academic Communication, Experimentation, Predictive Models, Theory, Legal Language, Behavioral Design, IT Strategy, Python, Databases |
| Places | Israel, New York, United States, United Kingdom, Hollywood, Broadway |
| Audience | Graduate, Undergraduate |

## How to choose tags

- Use the exact canonical label from the registry in Markdown, such as `tags: ["Interview", "Television", "Israel"]`.
- Usually choose 3 to 6 tags. Add one or two format tags, then specific topics and a relevant place. Do not add every broad parent topic automatically.
- Tag the article's actual subject. A Hollywood interview by an Israeli writer is not automatically about Israel. A film review mentioning a star is not an Interview.
- Keep individual names in `subjects` and the article inventory. Do not create a person tag for every interviewee. A recurring person can receive a deliberately approved tag later.
- Publisher, language, date, translation status, review status and permanent article ID remain metadata.
- Aliases are lookup aids, not extra tags on the same article. Use Television rather than adding both Television and TV.
- Existing `category` fields can remain for compatibility. New article templates use tags for public organization and introduce no additional category system.

## Examples

| Article | Tags |
| --- | --- |
| Julianne Moore interview, W046 | Interview, Film, Hollywood, Gender, Aging, New York |
| Sandra Oh and Jodie Comer interview, W089 | Interview, Television, Gender, LGBTQ+ |
| Israeli television representation column, W071 | Opinion, Television, LGBTQ+, Israel |
| Homeland set visit, W158 | Set Visit, Feature, Television |
| Database teaching post | Teaching, Databases, Education |
| Research on wording and engagement | Research, Computational Linguistics, Information Engagement |

## Tag browsing specification

The intended next implementation is a `/tags/` index and a `/tags/<slug>/` archive for each used tag, with tag chips linking internally in the same tab. Interview uses the stable slug `interview`; TV resolves to `television`; Israel uses `israel`.

An archive should collect tagged published entries across content collections, rather than only interviews. Reuse each collection's current public visibility rules, exclude workspace drafts and future-dated editorial entries, and link to actual existing pages or public listings. Tags with no public content need not have empty pages. Do not infer tags from collection names unless that mapping is explicit and reviewed.

The registry is preparation, not a new route: current interview tags are plain labels, and news currently has no tags field. Clickable archives and applying canonical aliases to live content are separate implementation work. Do not claim archive URLs exist until they are built.

