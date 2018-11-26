/**
 * This file should be placed at the node_modules sub-directory of the directory where you're 
 * executing it.
 * 
 * Written by Fernando Castor in November/2017. 
 */
exports.solve = function(fileName) {
    let formula = readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    console.log(result)
    if(result.isSat == true) {
      console.log(arrayParaString("satisfyingAssignment: " + result.satisfyingAssignment))
    }
    return result // two fields: isSat and satisfyingAssignment
  }
  
  // this function assigns the true or false values ​​of the assignment to the clauses and receives its logical value.
  function doSolve(clauses, assignment) {
    let isSat = false
    let valorVerdadeDisjuncao = 0
    let valorVerdadeConjuncao = 1
    let stringVerdade = []
    let currentAssignment = arrayParaString(assignment)
    let limite = limiteAssignment(assignment)
    while ((!isSat) && menorOuIgualDoisBinarios(currentAssignment, limite)) { /* must check whether this is the last assignment or not*/
      // does this assignment satisfy the formula? If so, make isSat true. 
      valorVerdadeConjuncao = 1
      for(let i = 0; i < clauses.length; i++) {
        for(let j = 0; j < clauses[i].length; j++) {
          if(parseInt(clauses[i][j]) < 0) {
            if(assignment[Math.abs(clauses[i][j]) - 1] == "0") {
              valorVerdadeDisjuncao = valorVerdadeDisjuncao || 1
            } else {
              valorVerdadeDisjuncao = valorVerdadeDisjuncao || 0
            }
          }
          if(parseInt(clauses[i][j]) > 0) {
              if(assignment[Math.abs(clauses[i][j]) - 1] == "0") {
                  valorVerdadeDisjuncao = valorVerdadeDisjuncao || 0
                } else {
                  valorVerdadeDisjuncao = valorVerdadeDisjuncao || 1
                }
              }
        }
        if(valorVerdadeDisjuncao === "0" || valorVerdadeDisjuncao == false) {
          stringVerdade[i] = "0"
          valorVerdadeConjuncao = valorVerdadeConjuncao && 0
        } else {
          stringVerdade[i] = "1"
          valorVerdadeConjuncao = valorVerdadeConjuncao && 1
        }
        valorVerdadeDisjuncao = 0
      }
      if(valorVerdadeConjuncao == 1) {
          isSat = true
      } else {
        // if not, get the next assignment and try again. 
        assignment = nextAssignment(assignment, limite)
        currentAssignment = arrayParaString(assignment)
        stringVerdade = []
      }
    }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
      result.satisfyingAssignment = assignment
    }
    return result
  }
  
  // this function determines the highest possible value of assignment based on the number of variables and calls it "limite".
  function limiteAssignment (assignment) { 
    let aux1 = ""
    for(let i = 0; i < assignment.length; i++) {
      aux1 = aux1 + "1"
    }
    return aux1
  }
  
  // this function produces the next assignment based on currentAssignment.
  // (receives the current assignment and produces the next one).
  function nextAssignment(currentAssignment, limite) {
    let stringAssignment = arrayParaString(currentAssignment)
    let newAssignment = adicaoDoisBinarios(stringAssignment, "1", limite).split("")
    return newAssignment
  }
  
  // this function transforms an array to a string.
  function arrayParaString(arrayEntrada) {
    let tamanho = arrayEntrada.length
    let stringSaida = "";
    for(let i = 0; i< tamanho; i++) {
      stringSaida = stringSaida + arrayEntrada[i]
    }
    return stringSaida
  }
  
  // this function adds two binary numbers and formats its size to match the number of variables.
  function adicaoDoisBinarios(numero1, numero2, limite) { // numero1 and numero2 are strings
    let adicaoDecimal = parseInt(numero1, 2) + parseInt(numero2, 2)
    let adicaoBinaria = adicaoDecimal.toString(2)
    let mascara = ""
    if (parseInt(numero1, 2) < parseInt(limite, 2)) {
      for(let i = 0; i < numero1.length; i++) {
          mascara = mascara + "0"
      }
      adicaoBinaria = (mascara + adicaoBinaria).slice(-numero1.length)
    }
    return adicaoBinaria
  }
  
  // this function compares two binary numbers: number1 must be less than or equal to number2 to return true.
  function menorOuIgualDoisBinarios(numero1, numero2) {
    if(parseInt(numero1, 2) <= parseInt(numero2, 2)) {
      return true
    } else {
      return false
    }
  }
    
  // this function reads the file and compares the numbers of clauses and variables specified
  // in the header of the .cnf file with those obtained in the file body.
  function readFormula(fileName) {
    const fs = require('fs')
    let arquivoLinha = fs.readFileSync(fileName, 'utf8')
    let text = arquivoLinha.split(/[\r\n]+/) 
    let clauses = readClauses(text)
    let variables = readVariables(clauses)
    
    // In the following line, text is passed as an argument so that the function
    // is able to extract the problem specification.
    let specOk = checkProblemSpecification(text, clauses, variables)
  
    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
      result.clauses = clauses
      result.variables = variables
    }
    return result
  }
  
  // this function extracts the clauses from the file body.
  function readClauses(text) {
    let clauses = []
    let aux1 = []
    let aux2 = []
    for (let i = 0; i < text.length; i++) {
      if (text[i][0] !== 'p' && text[i][0] !== 'c') {
        aux1 = text[i].split(' ')
        for(let j = 0; j < aux1.length; j++) {
          if(aux1[j] !== "" && aux1[j] !=='0') {
              aux2.push(aux1[j])
          } else if(aux1[j] === '0') {
            clauses.push(aux2)
            aux1 = []
            aux2 = []
          }
        }
      }
    }
    return clauses
  }
  
  // this function counts the number of variables in the clauses
  // (remember that the number N of variables determines themselves: 1, 2, 3, and so on, to N.)
  function readVariables(clauses) {
    let aux1 = []
    let variables = []
    for (let i = 0; i < clauses.length; i++) {
      for (let j = 0; j < clauses[i].length; j++) {
        if (!aux1.includes(Math.abs(clauses[i][j]))) {
          aux1.push(Math.abs(clauses[i][j]))
        }
      }
    }
    for (let i = 0; i < aux1.length; i++) {
      variables[i] = "0"
    }
    return variables
  }
  
  // this function checks whether the specification of the problem declared in the header matches the specification verified by the code.
  function checkProblemSpecification(text, clauses, variables) {
    let aux1 = []
    let numVariaveis
    let numClausulas
    let flag = false
    for(let i = 0; i < text.length; i++) {
      if(text[i][0] == 'p') {
       aux1 = text[i].split(' ')
       numVariaveis = aux1[2]
       numClausulas = aux1[3]
       i = text.length
       flag = true
      }
      if(numVariaveis == variables.length && numClausulas == clauses.length) {
        return true
      }
    }
    if (flag == false) {
      console.log("\nThis file has no 'p' signaling at the beginning of the specification line in the header.")
        return true
    } else {
      console.log("\nThe specification of the problem in the header doesn't match the specification extracted from the clauses.")
      return false
    }
  }