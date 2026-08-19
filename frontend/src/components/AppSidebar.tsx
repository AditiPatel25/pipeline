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
                {/* Main navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold tracking-wider">
                        MAIN
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="mt-3 gap-1">
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className="h-10 hover:pipeline-surface-hover">
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

                {/* Insights */}
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

            {/* User section */}
            <SidebarFooter className="border-t p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="h-11">
                            <button
                                type="button"
                                className="flex w-full items-center gap-3"
                            >
                                <User className="size-5" />

                                <span className="truncate text-sm font-medium">
                                    {user?.name ?? 'Account'}
                                </span>

                                <ChevronUp className="ml-auto size-4" />
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;