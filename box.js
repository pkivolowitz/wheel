class Box
{
	constructor()
	{
		this.vrts = [];
		this.vrts_buffer = null;
	}

	Initialize()
	{
		this.vrts_buffer = gl.createBuffer();
		this.PushVertex(this.vrts, vec3.fromValues(-1,  1, 0));
		this.PushVertex(this.vrts, vec3.fromValues( 1,  1, 0));
		this.PushVertex(this.vrts, vec3.fromValues( 1,  1, 0));
		this.PushVertex(this.vrts, vec3.fromValues( 1, -1, 0));
		this.PushVertex(this.vrts, vec3.fromValues( 1, -1, 0));
		this.PushVertex(this.vrts, vec3.fromValues(-1, -1, 0));
		this.PushVertex(this.vrts, vec3.fromValues(-1, -1, 0));
		this.PushVertex(this.vrts, vec3.fromValues(-1,  1, 0));
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vrts), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		this.InitializeShader();				
	}

	PushVertex(a, v)
	{
		a.push(v[0], v[1], v[2]);
	}

	InitializeShader()
	{
		this.p_shader = CreateShader("line-vertex_shader", "line-fragment_shader");
		gl.useProgram(this.p_shader);
		this.p_coordinates = gl.getAttribLocation(this.p_shader, "vertex_coordinates");
		this.p_modelview_matrix_handle = gl.getUniformLocation(this.p_shader, "modelview_matrix");
		this.p_projection_matrix_handle = gl.getUniformLocation(this.p_shader, "projection_matrix");
		gl.useProgram(null);
	}

	Draw(modelview_matrix, projection_matrix)
	{
		gl.useProgram(this.p_shader);
		gl.uniformMatrix4fv(this.p_projection_matrix_handle, false, projection_matrix);
		gl.uniformMatrix4fv(this.p_modelview_matrix_handle, false, modelview_matrix);		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.vertexAttribPointer(this.p_coordinates, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.p_coordinates);
		gl.drawArrays(gl.LINES, 0, this.vrts.length / 3);
		gl.disableVertexAttribArray(this.p_coordinates);
		gl.useProgram(null);
	}
}

