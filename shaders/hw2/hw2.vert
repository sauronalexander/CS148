#version 330

layout(location = 0) in vec4 vertexPosition;
uniform float inputTime;
uniform int period;

void main()
{
    vec4 modifiedVertexPosition = vertexPosition;

    // Insert your code for "Slightly-More Advanced Shaders" here.
    if(inputTime > period/2.) {
    	modifiedVertexPosition.y = modifiedVertexPosition.y - period/2.*0.1 + (inputTime-period/2.)*0.1;
    }
    else {
    	modifiedVertexPosition.y = modifiedVertexPosition.y - inputTime*0.1;
    }

    gl_Position = modifiedVertexPosition;
}
