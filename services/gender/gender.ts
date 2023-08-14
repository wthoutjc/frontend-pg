const getGender = async (
  name: string
): Promise<{
  count: number;
  gender: string | null;
  name: string;
  probability: number;
}> => {
  try {
    const response = await fetch(`https://api.genderize.io?name=${name.split(' ')[0]}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      count: 0,
      gender: null,
      name,
      probability: 0,
    };
  }
};

export { getGender };
