import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandX,
  IconChevronDown,
  IconRss,
} from '@tabler/icons-react';
import { AnnouncementProps, FooterProps, HeaderProps } from '../types';

// Announcement data
export const announcementData: AnnouncementProps = {
  title: 'NEW',
  callToAction: {
    text: 'This template is made with Next.js 14 using the new App Router »',
    href: 'https://nextjs.org/blog/next-14',
  },
  callToAction2: {
    text: 'Follow @onWidget on Twitter',
    href: 'https://twitter.com/intent/user?screen_name=onwidget',
  },
};

// Header data
export function getHeaderData(user?: {
  isCustomer: boolean;
  isProvider: boolean;
  loggedIn: boolean;
}): HeaderProps {
  const links = [
    {
      label: 'Home',
      href: '/',
    },
  ];

  if (user?.isCustomer) {
    links.push({
      label: 'Services',
      href: '/services',
    });
    links.push({
      label: 'My Bookings',
      href: '/bookings',
    });
  }

  if (user?.isProvider) {
    links.push({
      label: 'Create Service',
      href: '/services/create',
    });
    links.push({
      label: 'Provider Dashboard',
      href: '/provider/bookings',
    });
  }

  links.push({
    label: 'Contact',
    href: '/contact',
  });

  const actions = user?.loggedIn
    ? [
        {
          text: 'Logout',
          href: '/auth/logout',
        },
      ]
    : [
        {
          text: 'Login',
          href: '/auth/login',
        },
      ];

  return {
    links,
    actions,
    isSticky: true,
    showToggleTheme: true,
    showRssFeed: false,
    position: 'right',
  };
}

// Footer data
export const footerData: FooterProps = {
  title: 'Connectly',
  columns: [
    {
      title: 'Customer',
      links: [
        {
          label: 'Services',
          href: '/services',
        },
        {
          label: 'Security',
          href: '/',
        },
      ],
    },
    {
      title: 'Platform',
      links: [
        {
          label: 'Developer API',
          href: '/',
        },
      ],
    },
  ],
  socials: [
    { label: 'Twitter', icon: IconBrandX, href: 'https://x.com/OluwasegunIge4' },
    { label: 'Github', icon: IconBrandGithub, href: 'https://github.com/Tshergzeh/connectly' },
  ],
  footNote: (
    <div className="mr-4 rtl:mr-0 rtl:ml-4 text-sm">
      <span className="float-left rtl:float-right mr-1.5 rtl:mr-0 rtl:ml-1.5 h-5 w-5 rounded-sm bg-[url(https://onwidget.com/favicon/favicon-32x32.png)] bg-cover md:-mt-0.5 md:h-6 md:w-6"></span>
      <span>
        Template by{' '}
        <a
          className="font-semibold text-slate-900 dark:text-gray-200 hover:text-blue-600 hover:underline dark:hover:text-blue-600"
          href="https://onwidget.com/"
        >
          {' '}
          onWidget
        </a>{' '}
        · All rights reserved.
      </span>
    </div>
  ),
};

// Footer2 data
export const footerData2: FooterProps = {
  columns: [
    {
      title: 'Phone',
      texts: ['+234 901 167 0004'],
    },
    {
      title: 'Email',
      texts: ['oluwasegun.o.ige@gmail.com'],
    },
  ],
  socials: [
    { label: 'Twitter', icon: IconBrandX, href: 'https://x.com/OluwasegunIge4' },
    { label: 'Github', icon: IconBrandGithub, href: 'https://github.com/Tshergzeh/connectly' },
  ],
  footNote: (
    <div className="mr-4 rtl:mr-0 rtl:ml-4 text-sm">
      <span className="float-left rtl:float-right mr-1.5 rtl:mr-0 rtl:ml-1.5 h-5 w-5 rounded-sm bg-[url(https://onwidget.com/favicon/favicon-32x32.png)] bg-cover md:-mt-0.5 md:h-6 md:w-6"></span>
      <span>
        Template by{' '}
        <a
          className="font-semibold text-slate-900 dark:text-gray-200 hover:text-blue-600 hover:underline dark:hover:text-blue-600"
          href="https://onwidget.com/"
        >
          {' '}
          onWidget
        </a>{' '}
        · All rights reserved.
      </span>
    </div>
  ),
};

export const headerData = getHeaderData();
