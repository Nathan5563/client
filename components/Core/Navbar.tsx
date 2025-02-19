import { Fragment, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Feed', href: '/feed' },
  { name: 'Missions', href: '/tests/onboarding' },
];

const mobileNavigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Feed', href: '/feed' },
  { name: 'Missions', href: '/tests/onboarding' },
  { name: 'Planets', href: '/tests/planets' },
  { name: 'Inventory', href: '/#'},
  { name: 'Economy', href: '/balance' },
  { name: 'Documentation', href: '/#'},
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {    
    supabase
      .from("profiles")
      .select()
      .eq("id", session?.user?.id)
      .then((result) => {
        if (result.data) {
          setProfile(result.data[0]);
        }
    });
  }, [session]);

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                {/* <div className="flex flex-shrink-0 items-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="text-gray-100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="100%"
                      height="100%"
                      rx="16"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                      fill="black"
                    />
                  </svg>
                </div> */}
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'border-slate-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                      )}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="hidden sm:flex sm:items-center">
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                        <span className="sr-only">Open My Stuff menu</span>
                        My Stuff
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"> 
                        <Link legacyBehavior href ="/tests/planets" passHref>
                          <a
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Planets
                          </a>
                        </Link>
                        <Link legacyBehavior href ="/tests/onboarding" passHref>
                          <a
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Missions
                          </a>
                        </Link>
                        <Link legacyBehavior href ="/inventory" passHref>
                          <a
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Inventory
                          </a>
                        </Link>
                        <Link legacyBehavior href ="/tests/spaceships" passHref>
                          <a
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Spaceships
                          </a>
                        </Link>
                      </Menu.Items>
                    </Transition>
                  </Menu>
              </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kepler-22b.jpg/1200px-Kepler-22b.jpg'}
                        height={32}
                        width={32}
                        alt={`${'placeholder'} avatar`}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {session?.user ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'flex w-full px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Welcome, {profile?.username}
                              </button>
                            )}
                          </Menu.Item>
                          <Link legacyBehavior href ='/tests/planets' passHref>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'flex w-full px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  My planets
                                </button>
                              )}
                            </Menu.Item>
                          </Link>
                          <Link legacyBehavior href ='/tests/planets' passHref>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'flex w-full px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  My inventory
                                </button>
                              )}
                            </Menu.Item>
                          </Link>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'flex w-full px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={() => supabase.auth.signOut()}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <Link legacyBehavior href ='/login' passHref>
                              <button
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'flex w-full px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={() => console.log(session)}
                              >
                                Sign in
                              </button>
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {mobileNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-slate-50 border-slate-500 text-slate-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {session?.user ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {profile?.username}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {profile?.full_name}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <Link legacyBehavior href ='/login' passHref>
                    <button
                      className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign in
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}