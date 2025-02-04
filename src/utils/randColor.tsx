export function GenerateColorFromId(id: string): string {
    // 简单的哈希函数，将字符串转化为一个数值
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 将哈希值转化为颜色值
    const hue = Math.abs(hash % 360); // 取模 360 得到 0-360 之间的值
    const saturation = 70; // 固定的饱和度
    const lightness = 50; // 固定的亮度
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}