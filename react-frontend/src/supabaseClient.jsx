import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

  export async function removeAllItemInFolder (userID, bucketName, path) {
    //Remove all image inside folder as it should only have 1 image at a time
    const { data:list, errorGetList } = await supabase.storage
        .from(bucketName)
        .list(path);
    if (list) { alert("Data Found") }
    if (errorGetList) { alert(errorGetList.message) }

    const filesToRemove = list.map((x) => `${userID}/${x.name}`);
    const { data, errorRemove } = await supabase.storage
        .from(bucketName)
        .remove(filesToRemove);
    if (data) { alert(filesToRemove)}
    if (errorRemove) { alert(errorRemove.message) }

  }