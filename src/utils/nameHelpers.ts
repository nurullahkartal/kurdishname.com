import { NameData } from "../data/names";

export const getGenderClass = (gender: "male" | "female" | "unisex", prefix: string) => {
  return `${prefix}-${gender}`;
};

export const getGenderLabel = (gender: "male" | "female" | "unisex") => {
  if (gender === 'unisex') return 'UNİSEX';
  return gender === 'male' ? 'ERKEK' : 'KIZ';
};

export const getGenderText = (gender: "male" | "female" | "unisex") => {
  if (gender === 'unisex') return 'unisex';
  return gender === 'male' ? 'erkek' : 'kız';
};

export const getGenderPath = (gender: "male" | "female" | "unisex") => {
  if (gender === 'unisex') return null;
  return gender === 'male' ? 'erkek' : 'kiz';
};
