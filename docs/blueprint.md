# **App Name**: Midnapore CampusConnect

## Core Features:

- Automated Notice Aggregation: A scheduled background process that scrapes notices from the Midnapore College website (midnaporecollege.ac.in/category/notice/), handles pagination up to five pages, extracts notice titles, links, and dates, and stores them.
- Secure Notice API: An API endpoint serving aggregated college notices. This endpoint utilizes a caching mechanism for retrieved notices to minimize re-scraping and ensures data is refreshed via a periodic cron job.
- Dynamic Notice Board UI: A clean and modern user interface displaying college notices in a responsive card-based layout. Each card prominently features the notice title, publication date, and a direct link to the original source. The top 3 latest notices are visually highlighted.
- Intuitive Search and Filtering: Empower users with a search bar to filter notices by title and an optional date filter to narrow down announcements, enhancing discoverability.
- Robust Error Management: Comprehensive error handling is implemented to manage issues such as scraping failures or network errors, providing clear loading states and informative messages to the user.
- Mobile-First Responsiveness: The application's design fluidly adapts to deliver an optimal viewing and interaction experience across all devices, from desktops to mobile phones.
- AI Notice Summarizer Tool: A generative AI tool that automatically provides a concise summary for each notice, distilling its main purpose from the title and potentially from the content of the linked page.

## Style Guidelines:

- Primary color: A deep, professional blue (#2672DE) embodying clarity, reliability, and academic tradition, selected for its versatility and calming effect.
- Background color: A very light, desaturated blue (#F0F5FA), visually harmonizing with the primary hue while providing a clean and understated canvas for content.
- Accent color: A vibrant violet-blue (#602EFF) chosen for its dynamic energy and high contrast against the primary, ideal for interactive elements and calls to action.
- All text: 'Inter' (sans-serif) for its outstanding legibility, modern aesthetic, and suitability for various content types and screen sizes, ensuring a clean and accessible user experience.
- Use a set of clear, minimalist line icons for navigation, search, and action buttons. Icons should be easily understandable and complement the clean modern interface without adding visual clutter.
- Employ a responsive grid system for displaying notice cards, ensuring even spacing and readability on all device sizes. Content hierarchy will be established through consistent use of visual grouping and ample white space.
- Implement subtle hover effects on interactive elements and card displays, along with smooth transitions for content loading and filtering actions, to provide an engaging yet unobtrusive user experience.