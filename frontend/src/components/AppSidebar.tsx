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
        title: 'Interviews',
        url: '/interviews',
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
    const { user } = useAuth();

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
                        <SidebarMenuButton className="h-11">
                            <span className="flex w-full items-center justify-between gap-3">
                                <span className="font-semibold">
                                    Hi, {user?.name || 'User'}
                                </span>
                                <ChevronUp />
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
