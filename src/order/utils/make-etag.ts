export const makeETag = (order: {
	createdAt: Date;
	updatedAt?: Date | null;
}) => {
	const version = (order.updatedAt ?? order.createdAt).toISOString();
	return `"${version}"`;
};
