import type { Application } from '@/types/application';

type ApplicationCardProps = {
    application: Application;
};

function ApplicationCard({ application }: ApplicationCardProps) {
    return (
        <div>
            <h1>{application.company}</h1>
        </div>
    );
}

export default ApplicationCard;
