document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const methodSelect = document.getElementById("method")
    const bisectionInputs = document.getElementById("bisection-inputs")
    const newtonInputs = document.getElementById("newton-inputs")
    const secantInputs = document.getElementById("secant-inputs")
    const calculateButton = document.getElementById("calculate")
    const resultBox = document.getElementById("result-box")
    const finalResult = document.getElementById("final-result")
    const iterations = document.getElementById("iterations")
  
    // Show/hide input fields based on selected method
    methodSelect.addEventListener("change", () => {
      bisectionInputs.style.display = "none"
      newtonInputs.style.display = "none"
      secantInputs.style.display = "none"
  
      switch (methodSelect.value) {
        case "bisection":
          bisectionInputs.style.display = "block"
          break
        case "newton":
          newtonInputs.style.display = "block"
          break
        case "secant":
          secantInputs.style.display = "block"
          break
      }
    })
  
    // Calculate button click handler
    calculateButton.addEventListener("click", () => {
      try {
        // Get function and derivative from inputs
        const functionStr = document.getElementById("function").value
        const derivativeStr = document.getElementById("derivative").value
        const tolerance = Number.parseFloat(document.getElementById("tolerance").value)
  
        // Create function from string
        const f = (x) => eval(functionStr)
  
        // Create derivative function from string
        const df = (x) => eval(derivativeStr)
  
        let result
        const method = methodSelect.value
  
        // Clear previous results
        iterations.innerHTML = ""
  
        // Call appropriate method based on selection
        switch (method) {
          case "bisection":
            const a = Number.parseFloat(document.getElementById("a").value)
            const b = Number.parseFloat(document.getElementById("b").value)
            result = bisection(f, a, b, tolerance)
            break
  
          case "newton":
            const x0Newton = Number.parseFloat(document.getElementById("x0-newton").value)
            result = newtonRaphson(f, df, x0Newton, tolerance)
            break
  
          case "secant":
            const x0Secant = Number.parseFloat(document.getElementById("x0-secant").value)
            const x1Secant = Number.parseFloat(document.getElementById("x1-secant").value)
            result = secant(f, x0Secant, x1Secant, tolerance)
            break
        }
  
        // Display result
        if (result && result.root !== null) {
          resultBox.style.display = "block"
          finalResult.innerHTML = `
                      <p>Root found: <span style="color: #1b5e20">${result.root.toFixed(8)}</span></p>
                      <p>Function value at root: ${f(result.root).toFixed(8)}</p>
                      <p>Iterations: ${result.iterations}</p>
                  `
        } else {
          resultBox.style.display = "block"
          finalResult.innerHTML = '<p style="color: red;">Method failed to converge. Try different initial values.</p>'
        }
  
        // Scroll to results
        resultBox.scrollIntoView({ behavior: "smooth" })
      } catch (error) {
        alert("Error: " + error.message)
      }
    })
  
    // Bisection Method
    function bisection(f, a, b, tol = 1e-6) {
      if (f(a) * f(b) >= 0) {
        alert("Bisection method requires f(a) and f(b) to have opposite signs.")
        return { root: null, iterations: 0 }
      }
  
      let iterations = 0
      let tableHTML =
        "<table><thead><tr><th>Iteration</th><th>a</th><th>b</th><th>c</th><th>f(c)</th></tr></thead><tbody>"
  
      let c
      while ((b - a) / 2 > tol && iterations < 100) {
        iterations++
        c = (a + b) / 2
        const fc = f(c)
  
        tableHTML += `<tr>
                  <td>${iterations}</td>
                  <td>${a.toFixed(6)}</td>
                  <td>${b.toFixed(6)}</td>
                  <td>${c.toFixed(6)}</td>
                  <td>${fc.toFixed(6)}</td>
              </tr>`
  
        if (fc === 0) {
          break // Found exact root
        } else if (f(a) * fc < 0) {
          b = c
        } else {
          a = c
        }
      }
  
      tableHTML += "</tbody></table>"
      iterations.innerHTML = tableHTML
  
      const result = (a + b) / 2
      return { root: result, iterations: iterations }
    }
  
    // Newton-Raphson Method
    function newtonRaphson(f, df, x0, tol = 1e-6) {
      let xn = x0
      let iterations = 0
  
      let tableHTML =
        "<table><thead><tr><th>Iteration</th><th>x_n</th><th>f(x_n)</th><th>f'(x_n)</th><th>x_{n+1}</th></tr></thead><tbody>"
  
      for (let i = 0; i < 100; i++) {
        // Max iterations
        iterations++
        const fxn = f(xn)
        const dfxn = df(xn)
  
        if (Math.abs(dfxn) < 1e-10) {
          alert("Newton-Raphson method failed - derivative too close to zero.")
          return { root: null, iterations: iterations }
        }
  
        const xn1 = xn - fxn / dfxn
  
        tableHTML += `<tr>
                  <td>${iterations}</td>
                  <td>${xn.toFixed(6)}</td>
                  <td>${fxn.toFixed(6)}</td>
                  <td>${dfxn.toFixed(6)}</td>
                  <td>${xn1.toFixed(6)}</td>
              </tr>`
  
        if (Math.abs(fxn) < tol) {
          iterations.innerHTML = tableHTML + "</tbody></table>"
          return { root: xn, iterations: iterations }
        }
  
        xn = xn1
      }
  
      iterations.innerHTML = tableHTML + "</tbody></table>"
      return { root: xn, iterations: iterations }
    }
  
    // Secant Method
    function secant(f, x0, x1, tol = 1e-6) {
      let iterations = 0
  
      let tableHTML =
        "<table><thead><tr><th>Iteration</th><th>x_0</th><th>x_1</th><th>f(x_0)</th><th>f(x_1)</th><th>x_next</th></tr></thead><tbody>"
  
      for (let i = 0; i < 100; i++) {
        // Max iterations
        iterations++
        const fx0 = f(x0)
        const fx1 = f(x1)
  
        if (Math.abs(fx1) < tol) {
          iterations.innerHTML = tableHTML + "</tbody></table>"
          return { root: x1, iterations: iterations }
        }
  
        const denominator = fx1 - fx0
        if (Math.abs(denominator) < 1e-10) {
          alert("Secant method failed - division by near zero.")
          return { root: null, iterations: iterations }
        }
  
        const xTemp = x1 - (fx1 * (x1 - x0)) / denominator
  
        tableHTML += `<tr>
                  <td>${iterations}</td>
                  <td>${x0.toFixed(6)}</td>
                  <td>${x1.toFixed(6)}</td>
                  <td>${fx0.toFixed(6)}</td>
                  <td>${fx1.toFixed(6)}</td>
                  <td>${xTemp.toFixed(6)}</td>
              </tr>`
  
        x0 = x1
        x1 = xTemp
      }
  
      iterations.innerHTML = tableHTML + "</tbody></table>"
      return { root: x1, iterations: iterations }
    }
  })
  
  