import axios from "axios";
export const getPokiData = () => {
  return axios.get("https://pokeapi.co/api/v2/ability/?limit=20&offset=20 ");
};
