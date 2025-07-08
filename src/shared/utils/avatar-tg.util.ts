export async function avatarTgUtil(userPhotos: any, ctx: any): Promise<string> {
    if (userPhotos.total_count > 0) {
        const fileId = userPhotos.photos[0][0].file_id
        const file = await ctx.telegram.getFile(fileId)
        const filePath = file.file_path
        return filePath?.split('/').pop() || null
    }
}
