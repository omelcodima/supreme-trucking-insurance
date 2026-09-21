// Service areas, not branch offices or a list of carrier-approved risks.
export const stateCities: Record<string, readonly string[]> = {
  alabama: ["Birmingham", "Huntsville", "Montgomery", "Mobile"],
  arizona: ["Phoenix", "Tucson", "Mesa", "Chandler"],
  arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"],
  california: ["Los Angeles", "San Diego", "San Jose", "Sacramento", "Fresno", "Oakland"],
  colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins"],
  connecticut: ["Bridgeport", "New Haven", "Stamford", "Hartford"],
  delaware: ["Wilmington", "Dover", "Newark"],
  florida: ["Jacksonville", "Miami", "Tampa", "Orlando"],
  georgia: ["Atlanta", "Savannah", "Augusta", "Columbus"],
  idaho: ["Boise", "Nampa", "Meridian", "Idaho Falls"],
  illinois: ["Chicago", "Aurora", "Joliet", "Rockford"],
  indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"],
  iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"],
  kansas: ["Wichita", "Overland Park", "Kansas City", "Topeka"],
  kentucky: ["Louisville", "Lexington", "Bowling Green", "Owensboro"],
  louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"],
  maine: ["Portland", "Lewiston", "Bangor", "South Portland"],
  maryland: ["Baltimore", "Frederick", "Rockville", "Gaithersburg"],
  massachusetts: ["Boston", "Worcester", "Springfield", "Lowell"],
  michigan: ["Detroit", "Grand Rapids", "Warren", "Lansing"],
  minnesota: ["Minneapolis", "Saint Paul", "Rochester", "Duluth"],
  mississippi: ["Jackson", "Gulfport", "Southaven", "Hattiesburg"],
  missouri: ["Kansas City", "St. Louis", "Springfield", "Columbia"],
  montana: ["Billings", "Missoula", "Great Falls", "Bozeman"],
  nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island"],
  nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas"],
  "new-hampshire": ["Manchester", "Nashua", "Concord", "Dover"],
  "new-jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth"],
  "new-mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"],
  "new-york": ["New York City", "Buffalo", "Rochester", "Syracuse"],
  "north-carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham"],
  "north-dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot"],
  ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"],
  oregon: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Bend"],
  pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
  "rhode-island": ["Providence", "Warwick", "Cranston", "Pawtucket"],
  "south-carolina": ["Charleston", "Columbia", "Greenville", "North Charleston"],
  "south-dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"],
  tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
  texas: ["Houston", "Dallas", "Fort Worth", "San Antonio", "Austin", "El Paso"],
  utah: ["Salt Lake City", "West Valley City", "Provo", "Ogden"],
  vermont: ["Burlington", "South Burlington", "Rutland", "Montpelier"],
  virginia: ["Virginia Beach", "Norfolk", "Richmond", "Chesapeake"],
  washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Everett"],
  "west-virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg"],
  wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha"],
  wyoming: ["Cheyenne", "Casper", "Laramie", "Gillette"],
};

export type LocationDirectoryEntry = {
  name: string;
  abbreviation: string;
  slug: string;
  cities: { name: string; href?: string }[];
};

export function filterLocations(entries: LocationDirectoryEntry[], query: string) {
  const terms = query.trim().toLowerCase().replaceAll(".", "").split(/[\s,]+/).filter(Boolean);
  const abbreviations = new Set(entries.map(entry => entry.abbreviation.toLowerCase()));
  return entries.filter(entry => {
    const state = `${entry.name} ${entry.abbreviation}`.toLowerCase();
    return entry.cities.some(city => terms.every(term => abbreviations.has(term)
      ? entry.abbreviation.toLowerCase() === term
      : `${state} ${city.name.toLowerCase().replaceAll(".", "")}`.includes(term)));
  });
}
