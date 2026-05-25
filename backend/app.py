from flask import Flask, request, jsonify
from flask_cors import CORS
import social_solver.z3_solver as solver
import re

app = Flask(__name__)
CORS(app)


@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    n, k = data['n'], int(data['k'])

    edges = [tuple(edge) for edge in data['edges']]

    solver.reset_globals()
    kwargs = {'n': n, 'k': k, 'edges': edges}
    solver.gen_var_names(**kwargs)
    clauses = solver.gen_clauses(**kwargs)

    asgn = solver.solve_clauses(clauses)

    if asgn is not None:
        facts = [solver.var_number_to_name(x) for x in asgn]
        clique = [int(re.search(r',(\d+)\)', f).group(1)) for f in facts if "inClique" in f]
        return jsonify({"status": "SAT", "nodes": clique})
    else:
        return jsonify({"status": "UNSAT"})


if __name__ == '__main__':
    app.run(port=5000)