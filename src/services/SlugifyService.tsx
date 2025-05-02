export const slugifyService = {

    slugify(id: string, nome: string, cognome: string) {
        const formatText = (text: string) => {
            return text
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/--+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        };

        const formattedNome = formatText(nome);
        const formattedCognome = formatText(cognome);

        return `${id}-${formattedNome}-${formattedCognome}`;
    }


}