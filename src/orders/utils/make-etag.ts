export const makeETag = (order: {
	createdAt: Date;
	lastUpdatedAt?: Date | null;
}) => {
	const version = (order.lastUpdatedAt ?? order.createdAt).toISOString();
	return `"${version}"`;
};
