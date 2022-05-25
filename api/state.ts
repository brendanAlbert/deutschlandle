import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getTodaysDateFormatted = () => {
  const todays_date = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles'}).split(",")[0]; // 5/8/2022
  const split_array = todays_date.split("/");
  const year = split_array[2];
  const month = split_array[0].length === 2 ? split_array[0] : "0" + split_array[0];
  const day = split_array[1].length === 2 ? split_array[1] : "0" + split_array[1];

  // we need it to be of form 2022-05-08
  // formatted todays date
  const ftd = `${year}-${month}-${day}`;

  return ftd;
};

const getRandomNonRecentState = (prev: number[]) => {
    let newState = Math.floor(Math.random() * NUMBER_GERMAN_STATES);
    if (prev.length < NUMBER_GERMAN_STATES) {
      while (prev.includes(newState)) {
        newState = Math.floor(Math.random() * NUMBER_GERMAN_STATES);
      }
    }
    return newState
}

const getRandomNotLastTwoDaysState = (prev: number[]) => {
  let neuState = Math.floor(Math.random() * NUMBER_GERMAN_STATES);
  while (neuState == prev[15] || neuState == prev[14]) {
    neuState = Math.floor(Math.random() * NUMBER_GERMAN_STATES);
  }
  return neuState;
}

const NUMBER_GERMAN_STATES = 16;

export default async function handler(request, response) {

    const { data, error } = await supabase.from("de_table").select();
    
    const ftd = getTodaysDateFormatted();
    const contains_date_index = data.findIndex((date_obj) => date_obj.date === ftd);
    
    if (contains_date_index === -1) {
      // no state yet, generate state
        const { data: prev_data, error: prev_error } = await supabase.from("prev_states").select();
       
          const prevObj = prev_data[0] as any;
          const id = prevObj.id;
          let prev = prevObj.de.prev;

          let generated_state;
          if ( prev.length < NUMBER_GERMAN_STATES ) {
            generated_state = getRandomNonRecentState(prev);
          } else {
            generated_state = getRandomNotLastTwoDaysState(prev);
            prev = [];
          }

        const { data: insert_data , error: insert_error } = await supabase
          .from("de_table")
          .insert([{ date: ftd, state: generated_state }]);

          
          const newPrevStatesArray = [...prev, generated_state];
          
        const { data: prev_insert_data , error: prev_insert_error } = await supabase
          .from("prev_states")
          .upsert([{ de: { prev: newPrevStatesArray}, id }]);

          if (insert_error) response.status(500).json({ error_msg: insert_error });

          response.status(200).json({ state:  generated_state });
    }
    else {

        const state = data[contains_date_index].state
    
        if (error) response.status(500).json({ error_msg: error });
    
        response.status(200).json({ state });
    }

}
