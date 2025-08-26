export const getPromptFormat = (filename) => {
    if (filename.includes('early')) {
        return `
 Data extraction pages
 Early life video - data page
 Name (from previous data)
 Where city was this person born in?
 Birth cityWhat city is the hometown of this person?
 Hometown city
 Find the name(s) of schools this person went to and which cities the schools were in?
 School(s) (school names and locations)
 Find the name(s) of colleges or universities this person went to and also find the courses/programs they attended and which cities the colleges or universities were in?
 Universities / Colleges (Name, Course/program, and location)
 Find up to 10 tags that represent this person's life during this period including cities they lived in, sports played, interest areas, hobbies, and more?

 like eample for this is model in db 
  early_life_data: {
         Name: String,
         Birth_city: String,
         Hometown_city: String,
         Schools: {
             type: [
                 {
                     name: { type: String, required: true },
                     location: { type: String, required: true }
                 }
             ],
             default: []
         },
         Colleges: {
             type: [
                 {
                     name: { type: String, required: true },
                     location: { type: String, required: true }
                 }
             ],
             default: []
         },
         Early_life_tags: {
             type: [String],
             default: []
         }
     },
`;
    } else if (filename.includes('prof')) {
        return `
 Professional life video - data page
 Name (from form)
 Find the name of the company where this person had the first job. Also find the role(s) they played.
 Name of first job company
 Role played
 Find the name(s) of companies this person worked for other than the first job. Also find the role(s) they played in these companies.
 List of companies they worked in after first jobs
 With roles
 Find at least 10 tags that represent the person's professional life - what sectors they worked in, what were their specialisations, what did they learn, any favourite or special projects, any specific skills.
 Tags

 like eample for this is model in db 
   prof_life_data: {
         First_job: String,
         Other_roles: {
             type: [String],
             default: []
         },
         Other_companies: {
             type: [
                 {
                     companyName: { type: String, required: true },
                     role: { type: String, required: true },
                     place: { type: String, required: true }
                 }
             ],
             default: []
         },
         Professional_tags: {
             type: [String],
             default: []
         }
     },
`;
    } else if (filename.includes('curr')) {
        return `
 Current life video - data page
 Name (from form)
 Extract summary of this user's current life from the video. Make it less than 75 words.
 Which cities or city does this person live in?
 Names of cities they live in
 What is the name of their current organisation or organisations?
 Name of organisation(s)
 What is their current professional role or roles?
 Role(s)
 What cities do they frequently travel to?
 Find up to 10 tags that represent this person's life during this period including cities they lived, sports played, interest areas, hobbies, and more
 Find tags that represent the person's current life like - what sector(s) they work in, what is their specialisation(s), what are they learning, what are they working on, special skills and any other tags that represent this person

 like eample for this is model in db 
    curr_life_data: {
         Current_life_summary: String,
         Current_cities: {
             type: [String],
             default: []
         },
         Current_organizations: {
             type: [String],
             default: []
         },
         Current_roles: {
             type: [String],
             default: []
         },
         Travel_cities: {
             type: [String],
             default: []
         },
         Current_life_tags: {
             type: [String],
             default: []
         }
     },
`;
    }
    return null;
}