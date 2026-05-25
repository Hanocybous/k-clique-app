from flask import Flask, request, jsonify
from flask_cors import CORS
import z3_solver as solver
from subprocess import Popen, PIPE
import re

app = Flask(__name__)
CORS(app)


@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    n, k, edges = data['n'], data['k'], data['edges']

    solver.reset_globals()
    kwargs = {'n': n, 'k': k, 'edges': edges}
    solver.genVarNames(**kwargs)
    clauses = solver.genClauses(**kwargs)

    with open("solve_request.cnf", "w") as f:
        f.write(f"{solver.getDimacsHeader(clauses)}\n{solver.toDimacsCnf(clauses)}\n")

    process = Popen([solver.SATsolver + " solve_request.cnf"], stdout=PIPE, shell=True)
    output = process.communicate()[0].decode('utf-8').strip().split('\n')

    if output[0] == "s SATISFIABLE":
        asgn = map(int, output[1].split()[1:])
        facts = [solver.varNumberToName(abs(x)) for x in asgn if x > 0]
        clique = [int(re.search(r',(\d+)\)', f).group(1)) for f in facts if "inClique" in f]
        return jsonify({"status": "SAT", "nodes": clique})

    return jsonify({"status": "UNSAT", "nodes": []})


if __name__ == '__main__':
    app.run(port=5000)