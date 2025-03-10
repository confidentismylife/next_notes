import { Post } from './type';
import MasonryGrid from './MasonryGrid';

interface TimelineProps {
    posts?: Post[];
    isLoading?: boolean;
}

export default function Timeline({ posts = [], isLoading = false }: TimelineProps) {
    return (
        <div className="flex justify-center py-8">
            <div className="w-full max-w-[1500px]">
                <h2 className="text-xl font-bold mb-4 px-2">最新文章</h2>
                <MasonryGrid posts={isLoading ? [] : posts} columns={5} />
            </div>
        </div>
    );
} 