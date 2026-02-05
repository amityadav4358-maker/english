package com.example.compassapp

import android.animation.ObjectAnimator
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.ImageView
import android.widget.TextView
import kotlin.math.roundToInt

class MainActivity : AppCompatActivity(), SensorEventListener {
    private lateinit var sensorManager: SensorManager
    private val accel = FloatArray(3)
    private val magnet = FloatArray(3)
    private var hasAccel = false
    private var hasMag = false

    private lateinit var arrow: ImageView
    private lateinit var degreeText: TextView
    private var currentAzimuth = 0f

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        arrow = findViewById(R.id.compass_arrow)
        degreeText = findViewById(R.id.degree_text)

        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
    }

    override fun onResume() {
        super.onResume()
        sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.also { accelSensor ->
            sensorManager.registerListener(this, accelSensor, SensorManager.SENSOR_DELAY_UI)
        }
        sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)?.also { magSensor ->
            sensorManager.registerListener(this, magSensor, SensorManager.SENSOR_DELAY_UI)
        }
    }

    override fun onPause() {
        super.onPause()
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                System.arraycopy(event.values, 0, accel, 0, event.values.size)
                hasAccel = true
            }
            Sensor.TYPE_MAGNETIC_FIELD -> {
                System.arraycopy(event.values, 0, magnet, 0, event.values.size)
                hasMag = true
            }
        }

        if (hasAccel && hasMag) {
            val R = FloatArray(9)
            val I = FloatArray(9)
            val success = SensorManager.getRotationMatrix(R, I, accel, magnet)
            if (success) {
                val orientation = FloatArray(3)
                SensorManager.getOrientation(R, orientation)
                // orientation[0] is azimuth in radians (0 = North)
                val azimuthRad = orientation[0]
                val azimuthDeg = ((Math.toDegrees(azimuthRad.toDouble()) + 360) % 360).toFloat()

                // Smooth rotation: animate from currentAzimuth to new azimuth
                val from = -currentAzimuth
                val to = -azimuthDeg
                val animator = ObjectAnimator.ofFloat(arrow, "rotation", from, to)
                animator.duration = 250
                animator.start()
                currentAzimuth = azimuthDeg

                degreeText.text = "${azimuthDeg.roundToInt()}°"
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {
        // not used
    }
}