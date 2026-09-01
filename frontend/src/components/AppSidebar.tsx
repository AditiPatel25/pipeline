import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    BarChart3,
    Briefcase,
    CalendarDays,
    House,
    ChevronUp,
    User,
    Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const mainItems = [
    {
        title: 'Dashboard',
        url: '/',
        icon: House,
    },
    {
        title: 'Applications',
        url: '/applications',
        icon: Briefcase,
    },
    {
        title: 'Follow-Ups',
        url: '/followUps',
        icon: CalendarDays,
    },
    {
        title: 'Contacts',
        url: '/outreach',
        icon: Users,
    },
];

const insightItems = [
    {
        title: 'Analytics',
        url: '/analytics',
        icon: BarChart3,
    },
];

function AppSidebar() {
    const { user, logout } = useAuth();

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {/* main navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold tracking-wider">
                        MAIN
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="mt-3 gap-1">
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className="h-10">
                                        <Link
                                            to={item.url}
                                            className="flex w-full items-center gap-3"
                                        >
                                            <item.icon className="size-5" />
                                            <span className="text-sm font-medium">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* insights */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold tracking-wider">
                        INSIGHTS
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="mt-3 gap-1">
                            {insightItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className="h-10">
                                        <Link
                                            to={item.url}
                                            className="flex w-full items-center gap-3"
                                        >
                                            <item.icon className="size-5" />
                                            <span className="text-sm font-medium">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* user section */}
            <SidebarFooter className="border-t p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <SidebarMenuButton className="h-11">
                                        <span className="flex w-full items-center justify-between gap-3">
                                            <span className="font-semibold">
                                                Hi, {user?.name || 'User'}
                                            </span>
                                            <ChevronUp />
                                        </span>
                                    </SidebarMenuButton>
                                }
                            />

                            <DropdownMenuContent
                                className="w-48"
                                align="end"
                                side="top"
                            >
                                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
