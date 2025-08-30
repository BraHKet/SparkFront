// frontend/src/utils/exportUtils.js
export const exportToCSV = (painPoints) => {
    if (!painPoints || painPoints.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Pain Point", "Post Title", "Upvotes", "Comments", "URL"];
    csvContent += headers.join(",") + "\r\n";

    painPoints.forEach(pp => {
        pp.posts.forEach(post => {
            const row = [
                `"${pp.title.replace(/"/g, '""')}"`,
                `"${post.title.replace(/"/g, '""')}"`,
                post.upvotes,
                post.comments_count,
                post.url
            ];
            csvContent += row.join(",") + "\r\n";
        });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pain_points_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};