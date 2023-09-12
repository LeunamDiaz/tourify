import { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);

  return (
    'use client');

  import { Dropdown, Navbar } from 'flowbite-react';

  export default function NavbarWithDropdown() {
    return (
      <Navbar
        fluid
        rounded
      >
        <Navbar.Brand href="https://flowbite-react.com">
          <img
            alt="Flowbite React Logo"
            className="mr-3 h-6 sm:h-9"
            src="/favicon.svg" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Flowbite React
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            inline
            label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                Bonnie Green
              </span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </Dropdown.Header>
            <Item>
              Dashboard
            </Item>
            <Item>
              Settings
            </Item>
            <Item>
              Earnings
            </Item>
            <Dropdown.Divider />
            <Item>
              Sign out
            </Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link
            active
            href="#"
          >
            <p>
              Home
            </p>
          </Navbar.Link>
          <Navbar.Link href="#">
            About
          </Navbar.Link>
          <Navbar.Link href="#">
            Services
          </Navbar.Link>
          <Navbar.Link href="#">
            Pricing
          </Navbar.Link>
          <Navbar.Link href="#">
            Contact
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
