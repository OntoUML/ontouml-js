
//*********************************************************************
//*********************************************************************
//*** Check SQL Scripts ***********************************************
//*********************************************************************
export function checkScripts(targetScript: string, scripts: string[]): string {
    targetScript = targetScript.toLowerCase();
    
    for(let i = 0; i < scripts.length; i++){
        scripts[i] = scripts[i].toLowerCase();
    }

    let result: string = '';
    
    result = checkTableNumber(targetScript, scripts);
    if(result !== '') return result;
    
    result = checkFKNumber(targetScript, scripts);
    if(result !== '') return result;

    result = checkIndexNumber(targetScript, scripts);
    if(result !== '') return result;

    result = matchScripts(targetScript, scripts);
    if(result !== '') return result;
    
    return '';
}

function checkTableNumber(targetScript: string, scripts: string[]): string{
    
    let countTable: number = (targetScript.match(/create table/g) || []).length;
    let countToCheck: number = 0;

    scripts.forEach( (script: string) =>{
        if( (script.match(/create table/g) || []).length  === 1 ){
            countToCheck++;
        }
    });

    if( countTable === countToCheck ){
        return '';
    }else{
        return 'The number of tables not match. It should have: ' + countToCheck + '. Found: '+ countTable;
    }
}

function checkFKNumber(targetScript: string, scripts: string[]): string{
    let countFK: number = (targetScript.match(/add foreign key/g) || []).length;
    let countToCheck: number = 0;

    scripts.forEach( (script: string) =>{
        if( (script.match(/add foreign key/g) || []).length  === 1 ){
            countToCheck++;
        }
    });

    if( countFK === countToCheck ){
        return '';
    }else{
        return 'The number of foreign keys not match. It should have: ' + countToCheck + '. Found: '+ countFK;
    }
}

function checkIndexNumber(targetScript: string, scripts: string[]): string{
    let countFK: number = (targetScript.match(/create index/g) || []).length;
    let countToCheck: number = 0;

    scripts.forEach( (script: string) =>{
        if( (script.match(/create index/g) || []).length  === 1 ){
            countToCheck++;
        }
    });

    if( countFK === countToCheck ){
        return '';
    }else{
        return 'The number of index not match. It should have: ' + countToCheck + '. Found: '+ countFK;
    }
}

function matchScripts(targetScript: string, scripts: string[]): string{
    let result: string = '';
    let scriptWithoutBlankSpaces: string = '';
    targetScript = handlesText(targetScript);

    scripts.forEach( (script: string) => {        
        scriptWithoutBlankSpaces = handlesText(script);

        if( (targetScript.match(new RegExp(scriptWithoutBlankSpaces, 'g')) || []).length !== 1 ){
            result += 'The following script does not match or not found: ' + script  + '\n\n';
        }
    });
    
    return result;
}

//*********************************************************************
//*********************************************************************
//*** Check OBDA Mapping **********************************************
//*********************************************************************

export function checkObdaMapping(targeMapping: string, mappings: string[]): string {
    targeMapping = targeMapping.toLowerCase();
    
    for(let i = 0; i < mappings.length; i++){
        mappings[i] = mappings[i].toLowerCase();
    }

    let result: string = '';
    
    result = checkMappingNumber(targeMapping, mappings);
    if(result !== '') return result;

    result = matchMapping(targeMapping, mappings);
    if(result !== '') return result;

    return '';
}


function checkMappingNumber(targeMapping: string, mappings: string[]): string {
    let countMappings: number = (targeMapping.match(/mappingid/g) || []).length;
    let countToCheck: number = 0;

    mappings.forEach( (script: string) =>{
        if( (script.match(/mappingid/g) || []).length  === 1 ){
            countToCheck++;
        }
    });
    
    if( countMappings === countToCheck ){
        return '';
    }else{
        return 'The number of OBDA mappings not match. It should have: ' + countToCheck + '. Found: '+ countMappings;
    }
}

function matchMapping(targetMapping: string, mappings: string[]): string{
    let result: string = '';
    let scriptWithoutBlankSpaces: string = '';
    targetMapping = handlesText(targetMapping);

   // console.log(targetMapping);
    mappings.forEach( (mapping: string) => {        
        scriptWithoutBlankSpaces = handlesText(mapping);
        //console.log(scriptWithoutBlankSpaces);

        if( (targetMapping.match(new RegExp(scriptWithoutBlankSpaces, 'g')) || []).length !== 1 ){
            result += 'The following mapping does not match or not found: ' + mapping  + '\n\n';
        }
    });
    
    return result;
}

// *************************************************
// *************************************************
// *************************************************
function handlesText(text: string): string {
    return text
      .replace(/\s/g, '')
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/\^/g, '');
  }