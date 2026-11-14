export interface UuidInput {
  count: number;
  uppercase: boolean;
}

export const generateUuids = ({ count, uppercase }: UuidInput) => {
  const uuids = Array.from({ length: count }, () => crypto.randomUUID()).join("\n");
  return { uuids: uppercase ? uuids.toUpperCase() : uuids };
};
