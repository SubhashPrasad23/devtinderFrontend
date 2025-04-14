export const capitalized=(name)=>{
    const letter=name?.split(" ")
    const capitalized=letter.map((letter)=>letter.charAt(0).toUpperCase()+letter.slice(1))
return capitalized.join(" ")
}

