import { FollowUp } from '@/types/followUp';

type FollowUpCardProps = {
    followUp: FollowUp;
    onDelete: (followUpId: number) => Promise<void>;
    onEdit: (followUp: FollowUp) => void;
};

function FollowUpCard({
    followUp,
    onDelete,
    onEdit,
}: FollowUpCardProps) {
    return <div>
        <p>{followUp.title}</p>
    </div>;
}

export default FollowUpCard;
